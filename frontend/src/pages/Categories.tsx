import { useState } from "react";
import { Button, Form, Input, Modal, Select, Table, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { mockCategories } from "../mocks/finance";
import type { Category } from "../types/finance";

const { Title } = Typography;

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = (values: { name: string; type: Category["type"] }) => {
    const newCategory: Category = {
      id: Math.max(0, ...categories.map((c) => c.id)) + 1,
      ...values,
    };
    setCategories([...categories, newCategory]);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Категории</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Добавить категорию
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={categories}
        pagination={false}
        columns={[
          { title: "Название", dataIndex: "name" },
          {
            title: "Тип",
            dataIndex: "type",
            render: (type: Category["type"]) =>
              type === "income" ? (
                <Tag color="green">Доход</Tag>
              ) : (
                <Tag color="red">Расход</Tag>
              ),
          },
        ]}
      />

      <Modal
        title="Новая категория"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Название" rules={[{ required: true, message: "Укажите название категории" }]}>
            <Input placeholder="Например, Продукты" />
          </Form.Item>
          <Form.Item name="type" label="Тип" initialValue="expense" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "income", label: "Доход" },
                { value: "expense", label: "Расход" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
