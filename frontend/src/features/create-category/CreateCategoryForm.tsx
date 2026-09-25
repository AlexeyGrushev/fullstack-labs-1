import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import type { Category, CategoryInput } from "../../entities/category";

interface CreateCategoryFormProps {
  open: boolean;
  editingCategory: Category | null;
  onCancel: () => void;
  onSubmit: (values: CategoryInput) => Promise<void> | void;
}

export function CreateCategoryForm({
  open,
  editingCategory,
  onCancel,
  onSubmit,
}: CreateCategoryFormProps) {
  const [form] = Form.useForm<CategoryInput>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(editingCategory ?? { name: "", type: "expense" });
    }
  }, [open, editingCategory, form]);

  const handleFinish = async (values: CategoryInput) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={editingCategory ? "Изменить категорию" : "Новая категория"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={editingCategory ? "Сохранить" : "Создать"}
      cancelText="Отмена"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Название"
          rules={[
            { required: true, message: "Укажите название категории" },
            { min: 2, message: "Минимум 2 символа" },
          ]}
        >
          <Input placeholder="Например, Продукты" />
        </Form.Item>
        <Form.Item name="type" label="Тип" rules={[{ required: true, message: "Выберите тип категории" }]}>
          <Select
            options={[
              { value: "income", label: "Доход" },
              { value: "expense", label: "Расход" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
