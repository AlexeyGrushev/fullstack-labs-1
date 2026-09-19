import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import type { Account } from "../../entities/account";
import type { Category } from "../../entities/category";
import type { Transaction } from "../../entities/transaction";

interface CreateTransactionValues {
  accountId: number;
  categoryId: number;
  amount: number;
  description: string;
  date: dayjs.Dayjs;
}

interface CreateTransactionFormProps {
  open: boolean;
  accounts: Account[];
  categories: Category[];
  onCancel: () => void;
  onCreate: (transaction: Omit<Transaction, "id" | "type">, categoryType: Category["type"]) => void;
}

export function CreateTransactionForm({
  open,
  accounts,
  categories,
  onCancel,
  onCreate,
}: CreateTransactionFormProps) {
  const [form] = Form.useForm<CreateTransactionValues>();

  const handleFinish = (values: CreateTransactionValues) => {
    const category = categories.find((c) => c.id === values.categoryId);
    if (!category) {
      return;
    }
    onCreate(
      {
        accountId: values.accountId,
        categoryId: values.categoryId,
        amount: values.amount,
        description: values.description,
        date: values.date.format("YYYY-MM-DD"),
      },
      category.type
    );
    form.resetFields();
  };

  return (
    <Modal
      title="Новая операция"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Создать"
      cancelText="Отмена"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="accountId"
          label="Счёт"
          rules={[{ required: true, message: "Выберите счёт" }]}
        >
          <Select
            placeholder="Выберите счёт"
            options={accounts.map((a) => ({ value: a.id, label: a.name }))}
          />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Категория"
          rules={[{ required: true, message: "Выберите категорию" }]}
        >
          <Select
            placeholder="Выберите категорию"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </Form.Item>
        <Form.Item name="amount" label="Сумма" rules={[{ required: true, message: "Укажите сумму" }]}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Описание"
          rules={[{ required: true, message: "Добавьте описание" }]}
        >
          <Input placeholder="Например, Продукты на неделю" />
        </Form.Item>
        <Form.Item
          name="date"
          label="Дата"
          initialValue={dayjs()}
          rules={[{ required: true, message: "Укажите дату" }]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
