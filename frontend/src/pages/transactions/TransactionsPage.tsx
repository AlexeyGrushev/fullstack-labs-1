import { useCallback, useState } from "react";
import { Button, Table, Tooltip, Typography } from "antd";
import { BugOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAccounts, type Account } from "../../entities/account";
import { fetchCategories, type Category } from "../../entities/category";
import {
  fetchTransactions,
  nextTransactionId,
  type Transaction,
} from "../../entities/transaction";
import { useAsyncResource } from "../../shared/lib/useAsyncResource";
import { AsyncState } from "../../shared/ui/AsyncState";
import { formatMoney } from "../../shared/lib/format";
import { CreateTransactionForm } from "../../features/create-transaction/CreateTransactionForm";

const { Title } = Typography;

export default function TransactionsPage() {
  const [simulateError, setSimulateError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localTransactions, setLocalTransactions] = useState<Transaction[] | null>(null);

  const loadPageData = useCallback(async () => {
    const [accounts, categories, transactions] = await Promise.all([
      fetchAccounts(simulateError),
      fetchCategories(simulateError),
      fetchTransactions(simulateError),
    ]);
    return { accounts, categories, transactions };
  }, [simulateError]);

  const { data, isLoading, error, reload } = useAsyncResource(loadPageData);

  const transactions = localTransactions ?? data?.transactions ?? [];
  const accounts: Account[] = data?.accounts ?? [];
  const categories: Category[] = data?.categories ?? [];

  const handleCreate = (
    values: Omit<Transaction, "id" | "type">,
    categoryType: Category["type"]
  ) => {
    const newTransaction: Transaction = {
      id: nextTransactionId(transactions),
      type: categoryType,
      ...values,
    };
    setLocalTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Транзакции</Title>
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip title="Демонстрация состояния ошибки загрузки для лабораторной работы">
            <Button
              icon={<BugOutlined />}
              danger={simulateError}
              onClick={() => setSimulateError((prev) => !prev)}
            >
              {simulateError ? "Ошибка включена" : "Симулировать ошибку"}
            </Button>
          </Tooltip>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Добавить операцию
          </Button>
        </div>
      </div>

      <AsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && transactions.length === 0}
        emptyText="Операций пока нет"
        onRetry={reload}
      >
        <Table
          rowKey="id"
          dataSource={[...transactions].sort((a, b) => (a.date < b.date ? 1 : -1))}
          columns={[
            { title: "Дата", dataIndex: "date" },
            {
              title: "Счёт",
              dataIndex: "accountId",
              render: (accountId: number) =>
                accounts.find((a) => a.id === accountId)?.name ?? "—",
            },
            {
              title: "Категория",
              dataIndex: "categoryId",
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
          ]}
        />
      </AsyncState>

      <CreateTransactionForm
        open={isModalOpen}
        accounts={accounts}
        categories={categories}
        onCancel={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
