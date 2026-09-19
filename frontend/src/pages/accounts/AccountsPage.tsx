import { useState } from "react";
import { Button, Card, Col, Row, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { mockAccounts, nextAccountId, type Account } from "../../entities/account";
import { formatMoney } from "../../shared/lib/format";
import { CreateAccountForm } from "../../features/create-account/CreateAccountForm";

const { Title } = Typography;

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (values: Omit<Account, "id">) => {
    const newAccount: Account = { id: nextAccountId(accounts), ...values };
    setAccounts([...accounts, newAccount]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Счета</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Добавить счёт
        </Button>
      </div>

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

      <CreateAccountForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
