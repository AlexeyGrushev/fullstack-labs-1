import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/AuthProvider";
import { ApiError } from "../../shared/lib/apiClient";

interface LoginValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async (values: LoginValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось войти");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleFinish}>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Укажите email" },
          { type: "email", message: "Некорректный email" },
        ]}
      >
        <Input placeholder="you@example.com" autoComplete="username" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Пароль"
        rules={[{ required: true, message: "Укажите пароль" }]}
      >
        <Input.Password autoComplete="current-password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={isSubmitting}>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
}
