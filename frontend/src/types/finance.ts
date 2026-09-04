export type TransactionType = "income" | "expense";

export interface Account {
  id: number;
  name: string;
  currency: string;
  balance: number;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
}

export interface Transaction {
  id: number;
  accountId: number;
  categoryId: number;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
}
