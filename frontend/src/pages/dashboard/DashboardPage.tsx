import { useCallback } from "react";
import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { fetchAccounts } from "../../entities/account";
import { fetchCategories } from "../../entities/category";
import { fetchTransactions } from "../../entities/transaction";
import { useAsyncResource } from "../../shared/lib/useAsyncResource";
import { AsyncState } from "../../shared/ui/AsyncState";
import { FadeIn } from "../../shared/ui/FadeIn";
import { formatMoney } from "../../shared/lib/format";

const { Title } = Typography;

export default function DashboardPage() {
  const loadOverview = useCallback(async () => {
    const [accounts, categories, transactions] = await Promise.all([
      fetchAccounts(),
      fetchCategories(),
      fetchTransactions(),
    ]);
    return { accounts, categories, transactions };
  }, []);

  const { data, isLoading, error, reload } = useAsyncResource(loadOverview);

  return (
    <div>
      <Title level={3}>Обзор</Title>

      <AsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && (data?.transactions.length ?? 0) === 0}
        emptyText="Пока нет операций"
        onRetry={reload}
      >
        {data && (
          <FadeIn>
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
                .sort((a, b) => (a.occurred_on < b.occurred_on ? 1 : -1))
                .slice(0, 5)}
              pagination={false}
              columns={[
                { title: "Дата", dataIndex: "occurred_on" },
                {
                  title: "Категория",
                  dataIndex: "category_id",
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
          </FadeIn>
        )}
      </AsyncState>
    </div>
  );
}
