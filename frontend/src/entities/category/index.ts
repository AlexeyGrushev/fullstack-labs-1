import { withDelayedFailure } from "../../shared/lib/mockDelay";

export type TransactionType = "income" | "expense";

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
}

export const mockCategories: Category[] = [
  { id: 1, name: "Зарплата", type: "income" },
  { id: 2, name: "Подработка", type: "income" },
  { id: 3, name: "Продукты", type: "expense" },
  { id: 4, name: "Транспорт", type: "expense" },
  { id: 5, name: "Развлечения", type: "expense" },
  { id: 6, name: "Коммунальные платежи", type: "expense" },
  { id: 7, name: "Образование", type: "expense" },
];

export function fetchCategories(simulateError = false): Promise<Category[]> {
  return withDelayedFailure(mockCategories, simulateError);
}

export function nextCategoryId(categories: Category[]): number {
  return Math.max(0, ...categories.map((c) => c.id)) + 1;
}
