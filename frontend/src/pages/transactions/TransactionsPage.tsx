import { useState } from "react";
import { Button, Table, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { mockAccounts } from "../../entities/account";
import { mockCategories, type Category } from "../../entities/category";
import { mockTransactions, nextTransactionId, type Transaction } from "../../entities/transaction";
import { formatMoney } from "../../shared/lib/format";
import { CreateTransactionForm } from "../../features/create-transaction/CreateTransactionForm";

const { Title } = Typography;

export default function TransactionsPage() {
  const [accounts] = useState(mockAccounts);
  const [categories] = useState(mockCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (
    values: Omit<Transaction, "id" | "type">,
    categoryType: Category["type"]
  ) => {
    const newTransaction: Transaction = {
      id: nextTransactionId(transactions),
      type: categoryType,
      ...values,
    };
    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Транзакции</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Добавить операцию
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={[...transactions].sort((a, b) => (a.date < b.date ? 1 : -1))}
        columns={[
          { title: "Дата", dataIndex: "date" },
          {
            title: "Счёт",
            dataIndex: "accountId",
            render: (accountId: number) => accounts.find((a) => a.id === accountId)?.name ?? "—",
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
