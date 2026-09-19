import type { ReactNode } from "react";
import { Alert, Button, Empty, Skeleton } from "antd";

interface AsyncStateProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyText?: string;
  onRetry: () => void;
  children: ReactNode;
}

export function AsyncState({
  isLoading,
  error,
  isEmpty,
  emptyText = "Нет данных",
  onRetry,
  children,
}: AsyncStateProps) {
  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Ошибка загрузки"
        description={error}
        action={
          <Button size="small" danger onClick={onRetry}>
            Повторить
          </Button>
        }
        showIcon
      />
    );
  }

  if (isEmpty) {
    return <Empty description={emptyText} />;
  }

  return <>{children}</>;
}
