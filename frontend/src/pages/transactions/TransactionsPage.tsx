import { useCallback, useState } from "react";
import { Button, Popconfirm, Select, Space, Table, Typography, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAccounts, type Account } from "../../entities/account";
import { fetchCategories, type Category } from "../../entities/category";
import {
  createTransactionRequest,
  deleteTransactionRequest,
  fetchTransactions,
  updateTransactionRequest,
  type Transaction,
  type TransactionInput,
} from "../../entities/transaction";
import { useAsyncResource } from "../../shared/lib/useAsyncResource";
import { AsyncState } from "../../shared/ui/AsyncState";
import { FadeIn } from "../../shared/ui/FadeIn";
import { formatMoney } from "../../shared/lib/format";
import { ApiError } from "../../shared/lib/apiClient";
import { CreateTransactionForm } from "../../features/create-transaction/CreateTransactionForm";

const { Title } = Typography;

type CategoryFilter = "all" | number;

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const loadPageData = useCallback(async () => {
    const [accounts, categories, transactions] = await Promise.all([
      fetchAccounts(),
      fetchCategories(),
      fetchTransactions(),
    ]);
    return { accounts, categories, transactions };
  }, []);

  const { data, isLoading, error, reload } = useAsyncResource(loadPageData);

  const transactions = data?.transactions ?? [];
  const accounts: Account[] = data?.accounts ?? [];
  const categories: Category[] = data?.categories ?? [];

  const visibleTransactions = transactions
    .filter((t) => categoryFilter === "all" || t.category_id === categoryFilter)
    .sort((a, b) => (a.occurred_on < b.occurred_on ? 1 : -1));

  const openCreateModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: TransactionInput) => {
    try {
      if (editingTransaction) {
        await updateTransactionRequest(editingTransaction.id, values);
        message.success("Операция обновлена");
      } else {
        await createTransactionRequest(values);
        message.success("Операция создана");
      }
      setIsModalOpen(false);
      reload();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "Не удалось сохранить операцию");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransactionRequest(id);
      message.success("Операция удалена");
      reload();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "Не удалось удалить операцию");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Транзакции</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Добавить операцию
        </Button>
      </div>

      <AsyncState isLoading={isLoading} error={error} isEmpty={false} onRetry={reload}>
        <FadeIn>
          <div style={{ marginBottom: 16 }}>
            <Select<CategoryFilter>
              style={{ width: 240 }}
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: "all", label: "Все категории" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>

          <AsyncState
            isLoading={false}
            error={null}
            isEmpty={visibleTransactions.length === 0}
            emptyText={
              transactions.length === 0
                ? "Операций пока нет"
                : "По выбранной категории операций нет"
            }
            onRetry={reload}
          >
            <Table
              rowKey="id"
              dataSource={visibleTransactions}
              columns={[
                { title: "Дата", dataIndex: "occurred_on" },
                {
                  title: "Счёт",
                  dataIndex: "account_id",
                  render: (accountId: number) =>
                    accounts.find((a) => a.id === accountId)?.name ?? "—",
                },
                {
                  title: "Категория",
                  dataIndex: "category_id",
                  render: (categoryId: number) =>
                    categories.find((c) => c.id === categoryId)?.name ?? "—",
                },
                { title: "Описание", dataIndex: "description" },
                {
                  title: "Сумма",
                  dataIndex: "amount",
                  render: (value: number, record: Transaction) => (
                    <span style={{ color: record.type === "income" ? "#3f8600" : "#cf1322" }}>
                      {record.type === "income" ? "+" : "-"}
                      {formatMoney(value)}
                    </span>
                  ),
                },
                {
                  title: "",
                  key: "actions",
                  render: (_, transaction) => (
                    <Space>
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(transaction)}
                      />
                      <Popconfirm
                        title="Удалить операцию?"
                        okText="Удалить"
                        cancelText="Отмена"
                        onConfirm={() => handleDelete(transaction.id)}
                      >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
            />
          </AsyncState>
        </FadeIn>
      </AsyncState>

      <CreateTransactionForm
        open={isModalOpen}
        accounts={accounts}
        categories={categories}
        editingTransaction={editingTransaction}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
