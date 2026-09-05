import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { mockAccounts, mockCategories, mockTransactions } from "../mocks/finance";

const { Title } = Typography;

export default function Dashboard() {
  const totalBalance = mockAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalIncome = mockTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = mockTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const recent = [...mockTransactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5)
    .map((t) => ({
      ...t,
      categoryName: mockCategories.find((c) => c.id === t.categoryId)?.name,
    }));

  return (
    <div>
      <Title level={3}>Обзор</Title>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Общий баланс" value={totalBalance} suffix="₽" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Доходы за период"
              value={totalIncome}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="₽"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Расходы за период"
              value={totalExpense}
              precision={0}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="₽"
            />
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: 24 }}>
        Последние операции
      </Title>
      <Table
        rowKey="id"
        dataSource={recent}
        pagination={false}
        columns={[
          { title: "Дата", dataIndex: "date" },
          { title: "Категория", dataIndex: "categoryName" },
          { title: "Описание", dataIndex: "description" },
          {
            title: "Сумма",
            dataIndex: "amount",
            render: (value: number, record) => (
              <span style={{ color: record.type === "income" ? "#3f8600" : "#cf1322" }}>
                {record.type === "income" ? "+" : "-"}
                {value.toLocaleString("ru-RU")} ₽
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
