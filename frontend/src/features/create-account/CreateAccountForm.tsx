import { Form, Input, InputNumber, Modal } from "antd";
import type { Account } from "../../entities/account";

interface CreateAccountValues {
  name: string;
  currency: string;
  balance: number;
}

interface CreateAccountFormProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (account: Omit<Account, "id">) => void;
}

export function CreateAccountForm({ open, onCancel, onCreate }: CreateAccountFormProps) {
  const [form] = Form.useForm<CreateAccountValues>();

  const handleFinish = (values: CreateAccountValues) => {
    onCreate(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Новый счёт"
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
          rules={[{ required: true, message: "Укажите название счёта" }]}
        >
          <Input placeholder="Например, Основная карта" />
        </Form.Item>
        <Form.Item name="currency" label="Валюта" initialValue="RUB" rules={[{ required: true }]}>
          <Input maxLength={3} />
        </Form.Item>
        <Form.Item name="balance" label="Начальный баланс" initialValue={0} rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
