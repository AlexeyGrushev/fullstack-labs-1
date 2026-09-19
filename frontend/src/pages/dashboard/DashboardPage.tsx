import { useCallback, useState } from "react";
import { Button, Card, Col, Row, Statistic, Table, Tooltip, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, BugOutlined } from "@ant-design/icons";
import { fetchAccounts } from "../../entities/account";
import { fetchCategories } from "../../entities/category";
import { fetchTransactions } from "../../entities/transaction";
import { useAsyncResource } from "../../shared/lib/useAsyncResource";
import { AsyncState } from "../../shared/ui/AsyncState";
import { formatMoney } from "../../shared/lib/format";

const { Title } = Typography;

export default function DashboardPage() {
  const [simulateError, setSimulateError] = useState(false);

  const loadOverview = useCallback(async () => {
    const [accounts, categories, transactions] = await Promise.all([
      fetchAccounts(simulateError),
      fetchCategories(simulateError),
      fetchTransactions(simulateError),
    ]);
    return { accounts, categories, transactions };
  }, [simulateError]);

  const { data, isLoading, error, reload } = useAsyncResource(loadOverview);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3}>Обзор</Title>
        <Tooltip title="Демонстрация состояния ошибки загрузки для лабораторной работы">
          <Button
            icon={<BugOutlined />}
            danger={simulateError}
            onClick={() => setSimulateError((prev) => !prev)}
          >
            {simulateError ? "Ошибка включена" : "Симулировать ошибку"}
          </Button>
        </Tooltip>
      </div>

      <AsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && (data?.transactions.length ?? 0) === 0}
        emptyText="Пока нет операций"
        onRetry={reload}
      >
        {data && (
          <>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Общий баланс"
                    value={data.accounts.reduce((sum, a) => sum + a.balance, 0)}
                    suffix="₽"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Доходы за период"
                    value={data.transactions
                      .filter((t) => t.type === "income")
                      .reduce((sum, t) => sum + t.amount, 0)}
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
                    value={data.transactions
                      .filter((t) => t.type === "expense")
                      .reduce((sum, t) => sum + t.amount, 0)}
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
              dataSource={[...data.transactions]
                .sort((a, b) => (a.date < b.date ? 1 : -1))
                .slice(0, 5)}
              pagination={false}
              columns={[
                { title: "Дата", dataIndex: "date" },
                {
                  title: "Категория",
                  dataIndex: "categoryId",
                  render: (categoryId: number) =>
                    data.categories.find((c) => c.id === categoryId)?.name ?? "—",
                },
                { title: "Описание", dataIndex: "description" },
                {
                  title: "Сумма",
                  dataIndex: "amount",
                  render: (value: number, record) => (
                    <span style={{ color: record.type === "income" ? "#3f8600" : "#cf1322" }}>
                      {record.type === "income" ? "+" : "-"}
                      {formatMoney(value)}
                    </span>
                  ),
                },
              ]}
            />
          </>
        )}
      </AsyncState>
    </div>
  );
}
