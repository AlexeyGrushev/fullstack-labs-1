import { Card, Typography } from "antd";
import { Link } from "react-router-dom";
import { RegisterForm } from "../../features/auth/RegisterForm";

const { Title, Text } = Typography;

export default function RegisterPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Регистрация
        </Title>
        <RegisterForm />
        <Text>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </Text>
      </Card>
    </div>
  );
}
