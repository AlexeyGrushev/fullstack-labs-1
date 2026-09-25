import {
  DashboardOutlined,
  LogoutOutlined,
  SwapOutlined,
  WalletOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps["items"] = [
  { key: "/", icon: <DashboardOutlined />, label: "Обзор" },
  { key: "/transactions", icon: <SwapOutlined />, label: "Транзакции" },
  { key: "/accounts", icon: <WalletOutlined />, label: "Счета" },
  { key: "/categories", icon: <TagsOutlined />, label: "Категории" },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Text style={{ fontSize: 16 }}>{user?.email}</Typography.Text>
          <Space>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Выйти
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
