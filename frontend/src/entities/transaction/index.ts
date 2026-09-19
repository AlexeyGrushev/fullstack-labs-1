import type { TransactionType } from "../category";

export interface Transaction {
  id: number;
  accountId: number;
  categoryId: number;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    accountId: 1,
    categoryId: 1,
    type: "income",
    amount: 85000,
    description: "Зарплата за август",
    date: "2026-08-31",
  },
  {
    id: 2,
    accountId: 1,
    categoryId: 3,
    type: "expense",
    amount: 4200,
    description: "Продукты на неделю",
    date: "2026-09-02",
  },
  {
    id: 3,
    accountId: 2,
    categoryId: 4,
    type: "expense",
    amount: 600,
    description: "Проезд",
    date: "2026-09-03",
  },
  {
    id: 4,
    accountId: 1,
    categoryId: 6,
    type: "expense",
    amount: 3800,
    description: "Оплата ЖКХ",
    date: "2026-09-04",
  },
  {
    id: 5,
    accountId: 3,
    categoryId: 2,
    type: "income",
    amount: 12000,
    description: "Фриланс-заказ",
    date: "2026-09-04",
  },
  {
    id: 6,
    accountId: 2,
    categoryId: 5,
    type: "expense",
    amount: 1500,
    description: "Кино",
    date: "2026-09-05",
  },
];

export function nextTransactionId(transactions: Transaction[]): number {
  return Math.max(0, ...transactions.map((t) => t.id)) + 1;
}
