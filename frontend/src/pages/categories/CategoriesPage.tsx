import { useCallback, useState } from "react";
import { Button, Table, Tag, Tooltip, Typography } from "antd";
import { BugOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchCategories, nextCategoryId, type Category } from "../../entities/category";
import { useAsyncResource } from "../../shared/lib/useAsyncResource";
import { AsyncState } from "../../shared/ui/AsyncState";
import { FadeIn } from "../../shared/ui/FadeIn";
import { CreateCategoryForm } from "../../features/create-category/CreateCategoryForm";

const { Title } = Typography;

export default function CategoriesPage() {
  const [simulateError, setSimulateError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState<Category[] | null>(null);

  const loadCategories = useCallback(() => fetchCategories(simulateError), [simulateError]);
  const { data, isLoading, error, reload } = useAsyncResource(loadCategories);

  const categories = localCategories ?? data ?? [];

  const handleCreate = (values: Omit<Category, "id">) => {
    const newCategory: Category = { id: nextCategoryId(categories), ...values };
    setLocalCategories([...categories, newCategory]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Категории</Title>
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
            Добавить категорию
          </Button>
        </div>
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
                  type === "income" ? (
                    <Tag color="green">Доход</Tag>
                  ) : (
                    <Tag color="red">Расход</Tag>
                  ),
              },
            ]}
          />
        </FadeIn>
      </AsyncState>

      <CreateCategoryForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
