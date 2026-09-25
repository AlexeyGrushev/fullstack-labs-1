import { apiRequest } from "../../shared/lib/apiClient";
import type { TransactionType } from "../category";

export interface Transaction {
  id: number;
  account_id: number;
  category_id: number;
  type: TransactionType;
  amount: number;
  description: string;
  occurred_on: string;
}

export type TransactionInput = Omit<Transaction, "id" | "type">;

export function fetchTransactions(): Promise<Transaction[]> {
  return apiRequest<Transaction[]>("/transactions");
}

export function createTransactionRequest(data: TransactionInput): Promise<Transaction> {
  return apiRequest<Transaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateTransactionRequest(
  id: number,
  data: TransactionInput
): Promise<Transaction> {
  return apiRequest<Transaction>(`/transactions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTransactionRequest(id: number): Promise<void> {
  return apiRequest<void>(`/transactions/${id}`, { method: "DELETE" });
}
