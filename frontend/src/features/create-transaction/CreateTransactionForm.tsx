import { useEffect } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import type { Account } from "../../entities/account";
import type { Category } from "../../entities/category";
import type { Transaction, TransactionInput } from "../../entities/transaction";

interface TransactionFormValues {
  account_id: number;
  category_id: number;
  amount: number;
  description: string;
  occurred_on: dayjs.Dayjs;
}

interface CreateTransactionFormProps {
  open: boolean;
  accounts: Account[];
  categories: Category[];
  editingTransaction: Transaction | null;
  onCancel: () => void;
  onSubmit: (values: TransactionInput) => Promise<void> | void;
}

export function CreateTransactionForm({
  open,
  accounts,
  categories,
  editingTransaction,
  onCancel,
  onSubmit,
}: CreateTransactionFormProps) {
  const [form] = Form.useForm<TransactionFormValues>();

  useEffect(() => {
    if (!open) return;
    if (editingTransaction) {
      form.setFieldsValue({
        account_id: editingTransaction.account_id,
        category_id: editingTransaction.category_id,
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        occurred_on: dayjs(editingTransaction.occurred_on),
      });
    } else {
      form.setFieldsValue({
        account_id: undefined,
        category_id: undefined,
        amount: undefined,
        description: "",
        occurred_on: dayjs(),
      });
    }
  }, [open, editingTransaction, form]);

  const handleFinish = async (values: TransactionFormValues) => {
    await onSubmit({
      account_id: values.account_id,
      category_id: values.category_id,
      amount: values.amount,
      description: values.description,
      occurred_on: values.occurred_on.format("YYYY-MM-DD"),
    });
    form.resetFields();
  };

  return (
    <Modal
      title={editingTransaction ? "Изменить операцию" : "Новая операция"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={editingTransaction ? "Сохранить" : "Создать"}
      cancelText="Отмена"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="account_id"
          label="Счёт"
          rules={[{ required: true, message: "Выберите счёт" }]}
        >
          <Select
            placeholder="Выберите счёт"
            options={accounts.map((a) => ({ value: a.id, label: a.name }))}
          />
        </Form.Item>
        <Form.Item
          name="category_id"
          label="Категория"
          rules={[{ required: true, message: "Выберите категорию" }]}
        >
          <Select
            placeholder="Выберите категорию"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Сумма"
          rules={[
            { required: true, message: "Укажите сумму" },
            {
              validator: (_, value) =>
                value > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Сумма должна быть больше нуля")),
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Описание"
          rules={[
            { required: true, message: "Добавьте описание" },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Например, Продукты на неделю" />
        </Form.Item>
        <Form.Item
          name="occurred_on"
          label="Дата"
          rules={[{ required: true, message: "Укажите дату" }]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
