import type { Account, Category, Transaction } from "../types/finance";

export const mockAccounts: Account[] = [
  { id: 1, name: "Основная карта", currency: "RUB", balance: 54200 },
  { id: 2, name: "Наличные", currency: "RUB", balance: 3100 },
  { id: 3, name: "Накопительный счёт", currency: "RUB", balance: 128000 },
];

export const mockCategories: Category[] = [
  { id: 1, name: "Зарплата", type: "income" },
  { id: 2, name: "Подработка", type: "income" },
  { id: 3, name: "Продукты", type: "expense" },
  { id: 4, name: "Транспорт", type: "expense" },
  { id: 5, name: "Развлечения", type: "expense" },
  { id: 6, name: "Коммунальные платежи", type: "expense" },
];

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
