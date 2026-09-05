import { useState } from "react";
import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { mockAccounts } from "../mocks/finance";
import type { Account } from "../types/finance";

const { Title } = Typography;

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = (values: { name: string; currency: string; balance: number }) => {
    const newAccount: Account = {
      id: Math.max(0, ...accounts.map((a) => a.id)) + 1,
      ...values,
    };
    setAccounts([...accounts, newAccount]);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Счета</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Добавить счёт
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {accounts.map((account) => (
          <Col xs={24} sm={12} md={8} key={account.id}>
            <Card title={account.name}>
              <Typography.Text strong style={{ fontSize: 20 }}>
                {account.balance.toLocaleString("ru-RU")} {account.currency}
              </Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Новый счёт"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Название" rules={[{ required: true, message: "Укажите название счёта" }]}>
            <Input placeholder="Например, Основная карта" />
          </Form.Item>
          <Form.Item name="currency" label="Валюта" initialValue="RUB" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="balance" label="Начальный баланс" initialValue={0} rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
