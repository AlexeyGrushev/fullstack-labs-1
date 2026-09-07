import {
  DashboardOutlined,
  SwapOutlined,
  WalletOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps["items"] = [
  { key: "/", icon: <DashboardOutlined />, label: "Обзор" },
  { key: "/transactions", icon: <SwapOutlined />, label: "Транзакции" },
  { key: "/accounts", icon: <WalletOutlined />, label: "Счета" },
  { key: "/categories", icon: <TagsOutlined />, label: "Категории" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            color: "#fff",
            fontWeight: 600,
            fontSize: 18,
            padding: "16px",
          }}
        >
          Личный финучёт
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <span style={{ fontSize: 16 }}>Александр Яблоков</span>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
