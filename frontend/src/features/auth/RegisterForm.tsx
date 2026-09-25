import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/AuthProvider";
import { ApiError } from "../../shared/lib/apiClient";

interface RegisterValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async (values: RegisterValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await register(values.email, values.password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось зарегистрироваться");
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
        rules={[
          { required: true, message: "Укажите пароль" },
          { min: 8, message: "Минимум 8 символов" },
        ]}
        hasFeedback
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="Повторите пароль"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Повторите пароль" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Пароли не совпадают"));
            },
          }),
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={isSubmitting}>
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
}
