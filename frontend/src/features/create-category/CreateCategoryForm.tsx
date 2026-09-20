import { Form, Input, Modal, Select } from "antd";
import type { Category, TransactionType } from "../../entities/category";

interface CreateCategoryValues {
  name: string;
  type: TransactionType;
}

interface CreateCategoryFormProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (category: Omit<Category, "id">) => void;
}

export function CreateCategoryForm({ open, onCancel, onCreate }: CreateCategoryFormProps) {
  const [form] = Form.useForm<CreateCategoryValues>();

  const handleFinish = (values: CreateCategoryValues) => {
    onCreate(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Новая категория"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Создать"
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
        <Form.Item
          name="type"
          label="Тип"
          initialValue="expense"
          rules={[{ required: true, message: "Выберите тип категории" }]}
        >
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
