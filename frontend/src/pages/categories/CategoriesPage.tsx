import { useState } from "react";
import { Button, Table, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { mockCategories, nextCategoryId, type Category } from "../../entities/category";
import { CreateCategoryForm } from "../../features/create-category/CreateCategoryForm";

const { Title } = Typography;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (values: Omit<Category, "id">) => {
    const newCategory: Category = { id: nextCategoryId(categories), ...values };
    setCategories([...categories, newCategory]);
    setIsModalOpen(false);
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
              type === "income" ? <Tag color="green">Доход</Tag> : <Tag color="red">Расход</Tag>,
          },
        ]}
      />

      <CreateCategoryForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
