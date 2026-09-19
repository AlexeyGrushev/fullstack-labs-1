import { useCallback, useState } from "react";
import { Button, Card, Col, Row, Tooltip, Typography } from "antd";
import { BugOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAccounts, nextAccountId, type Account } from "../../entities/account";
import { useAsyncResource } from "../../shared/lib/useAsyncResource";
import { AsyncState } from "../../shared/ui/AsyncState";
import { formatMoney } from "../../shared/lib/format";
import { CreateAccountForm } from "../../features/create-account/CreateAccountForm";

const { Title } = Typography;

export default function AccountsPage() {
  const [simulateError, setSimulateError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localAccounts, setLocalAccounts] = useState<Account[] | null>(null);

  const loadAccounts = useCallback(() => fetchAccounts(simulateError), [simulateError]);
  const { data, isLoading, error, reload } = useAsyncResource(loadAccounts);

  const accounts = localAccounts ?? data ?? [];

  const handleCreate = (values: Omit<Account, "id">) => {
    const newAccount: Account = { id: nextAccountId(accounts), ...values };
    setLocalAccounts([...accounts, newAccount]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Счета</Title>
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
            Добавить счёт
          </Button>
        </div>
      </div>

      <AsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && accounts.length === 0}
        emptyText="Счета ещё не добавлены"
        onRetry={reload}
      >
        <Row gutter={[16, 16]}>
          {accounts.map((account) => (
            <Col xs={24} sm={12} md={8} key={account.id}>
              <Card title={account.name}>
                <Typography.Text strong style={{ fontSize: 20 }}>
                  {formatMoney(account.balance, account.currency)}
                </Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </AsyncState>

      <CreateAccountForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
