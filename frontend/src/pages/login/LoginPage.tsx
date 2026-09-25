import { Card, Typography } from "antd";
import { Link } from "react-router-dom";
import { LoginForm } from "../../features/auth/LoginForm";

const { Title, Text } = Typography;

export default function LoginPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Личный финучёт
        </Title>
        <LoginForm />
        <Text>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </Text>
      </Card>
    </div>
  );
}
