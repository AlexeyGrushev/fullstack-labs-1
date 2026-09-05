import { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { mockAccounts, mockCategories, mockTransactions } from "../mocks/finance";
import type { Transaction } from "../types/finance";

const { Title } = Typography;

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: "Дата", dataIndex: "date" },
    {
      title: "Счёт",
      dataIndex: "accountId",
      render: (accountId: number) =>
        mockAccounts.find((a) => a.id === accountId)?.name ?? "—",
    },
    {
      title: "Категория",
      dataIndex: "categoryId",
      render: (categoryId: number) =>
        mockCategories.find((c) => c.id === categoryId)?.name ?? "—",
    },
    { title: "Описание", dataIndex: "description" },
    {
      title: "Сумма",
      dataIndex: "amount",
      render: (value: number, record: Transaction) => (
        <span style={{ color: record.type === "income" ? "#3f8600" : "#cf1322" }}>
          {record.type === "income" ? "+" : "-"}
          {value.toLocaleString("ru-RU")} ₽
        </span>
      ),
    },
  ];

  const handleCreate = (values: {
    accountId: number;
    categoryId: number;
    amount: number;
    description: string;
    date: dayjs.Dayjs;
  }) => {
    const category = mockCategories.find((c) => c.id === values.categoryId);
    const newTransaction: Transaction = {
      id: Math.max(0, ...transactions.map((t) => t.id)) + 1,
      accountId: values.accountId,
      categoryId: values.categoryId,
      type: category?.type ?? "expense",
      amount: values.amount,
      description: values.description,
      date: values.date.format("YYYY-MM-DD"),
    };
    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
    form.resetFields();
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
        columns={columns}
      />

      <Modal
        title="Новая операция"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="accountId" label="Счёт" rules={[{ required: true, message: "Выберите счёт" }]}>
            <Select options={mockAccounts.map((a) => ({ value: a.id, label: a.name }))} />
          </Form.Item>
          <Form.Item name="categoryId" label="Категория" rules={[{ required: true, message: "Выберите категорию" }]}>
            <Select options={mockCategories.map((c) => ({ value: c.id, label: c.name }))} />
          </Form.Item>
          <Form.Item name="amount" label="Сумма" rules={[{ required: true, message: "Укажите сумму" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="description" label="Описание" rules={[{ required: true, message: "Добавьте описание" }]}>
            <Input placeholder="Например, Продукты на неделю" />
          </Form.Item>
          <Form.Item name="date" label="Дата" initialValue={dayjs()} rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
