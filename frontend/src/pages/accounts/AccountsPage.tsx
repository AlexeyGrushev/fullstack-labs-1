import { useState } from "react";
import { Button, Card, Col, Popconfirm, Row, Space, Typography, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createAccountRequest,
  deleteAccountRequest,
  fetchAccounts,
  updateAccountRequest,
  type Account,
  type AccountInput,
} from "../../entities/account";
import { useAsyncResource } from "../../shared/lib/useAsyncResource";
import { AsyncState } from "../../shared/ui/AsyncState";
import { FadeIn } from "../../shared/ui/FadeIn";
import { formatMoney } from "../../shared/lib/format";
import { ApiError } from "../../shared/lib/apiClient";
import { CreateAccountForm } from "../../features/create-account/CreateAccountForm";

const { Title } = Typography;

export default function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const { data, isLoading, error, reload } = useAsyncResource(fetchAccounts);
  const accounts = data ?? [];

  const openCreateModal = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const openEditModal = (account: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: AccountInput) => {
    try {
      if (editingAccount) {
        await updateAccountRequest(editingAccount.id, values);
        message.success("Счёт обновлён");
      } else {
        await createAccountRequest(values);
        message.success("Счёт создан");
      }
      setIsModalOpen(false);
      reload();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "Не удалось сохранить счёт");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAccountRequest(id);
      message.success("Счёт удалён");
      reload();
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : "Не удалось удалить счёт");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Счета</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Добавить счёт
        </Button>
      </div>

      <AsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && accounts.length === 0}
        emptyText="Счета ещё не добавлены"
        onRetry={reload}
      >
        <FadeIn>
          <Row gutter={[16, 16]}>
            {accounts.map((account) => (
              <Col xs={24} sm={12} md={8} key={account.id}>
                <Card
                  title={account.name}
                  extra={
                    <Space>
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(account)}
                      />
                      <Popconfirm
                        title="Удалить счёт?"
                        description="Все операции по этому счёту тоже будут удалены."
                        okText="Удалить"
                        cancelText="Отмена"
                        onConfirm={() => handleDelete(account.id)}
                      >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <Typography.Text strong style={{ fontSize: 20 }}>
                    {formatMoney(account.balance, account.currency)}
                  </Typography.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </FadeIn>
      </AsyncState>

      <CreateAccountForm
        open={isModalOpen}
        editingAccount={editingAccount}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
