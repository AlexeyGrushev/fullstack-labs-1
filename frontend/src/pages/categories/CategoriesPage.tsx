import { useState } from "react";
import { Button, Popconfirm, Space, Table, Tag, Typography, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createCategoryRequest,
  deleteCategoryRequest,
  fetchCategories,
  updateCategoryRequest,
  type Category,
  type CategoryInput,
} from "../../entities/category";
import { useAsyncResource } from "../../shared/lib/useAsyncResource";
import { AsyncState } from "../../shared/ui/AsyncState";
import { FadeIn } from "../../shared/ui/FadeIn";
import { ApiError } from "../../shared/lib/apiClient";
import { CreateCategoryForm } from "../../features/create-category/CreateCategoryForm";

const { Title } = Typography;

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data, isLoading, error, reload } = useAsyncResource(fetchCategories);
  const categories = data ?? [];

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: CategoryInput) => {
    try {
      if (editingCategory) {
        await updateCategoryRequest(editingCategory.id, values);
        message.success("Категория обновлена");
      } else {
        await createCategoryRequest(values);
        message.success("Категория создана");
      }
      setIsModalOpen(false);
      reload();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "Не удалось сохранить категорию");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategoryRequest(id);
      message.success("Категория удалена");
      reload();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "Не удалось удалить категорию");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Категории</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Добавить категорию
        </Button>
      </div>

      <AsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && categories.length === 0}
        emptyText="Категории ещё не добавлены"
        onRetry={reload}
      >
        <FadeIn>
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
              {
                title: "",
                key: "actions",
                render: (_, category) => (
                  <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(category)} />
                    <Popconfirm
                      title="Удалить категорию?"
                      okText="Удалить"
                      cancelText="Отмена"
                      onConfirm={() => handleDelete(category.id)}
                    >
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </FadeIn>
      </AsyncState>

      <CreateCategoryForm
        open={isModalOpen}
        editingCategory={editingCategory}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
