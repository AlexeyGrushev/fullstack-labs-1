import { useEffect } from "react";
import { Form, Input, InputNumber, Modal } from "antd";
import type { Account, AccountInput } from "../../entities/account";

interface CreateAccountFormProps {
  open: boolean;
  editingAccount: Account | null;
  onCancel: () => void;
  onSubmit: (values: AccountInput) => Promise<void> | void;
}

export function CreateAccountForm({
  open,
  editingAccount,
  onCancel,
  onSubmit,
}: CreateAccountFormProps) {
  const [form] = Form.useForm<AccountInput>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        editingAccount ?? { name: "", currency: "RUB", balance: 0 }
      );
    }
  }, [open, editingAccount, form]);

  const handleFinish = async (values: AccountInput) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={editingAccount ? "Изменить счёт" : "Новый счёт"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={editingAccount ? "Сохранить" : "Создать"}
      cancelText="Отмена"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Название"
          rules={[
            { required: true, message: "Укажите название счёта" },
            { min: 2, message: "Минимум 2 символа" },
          ]}
        >
          <Input placeholder="Например, Основная карта" />
        </Form.Item>
        <Form.Item
          name="currency"
          label="Валюта"
          rules={[
            { required: true, message: "Укажите валюту" },
            { len: 3, message: "Код валюты — 3 буквы, например RUB" },
          ]}
        >
          <Input style={{ textTransform: "uppercase" }} maxLength={3} />
        </Form.Item>
        <Form.Item
          name="balance"
          label="Начальный баланс"
          rules={[{ required: true, message: "Укажите начальный баланс" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
