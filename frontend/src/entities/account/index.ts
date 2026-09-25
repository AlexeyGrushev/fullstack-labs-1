import { apiRequest } from "../../shared/lib/apiClient";

export interface Account {
  id: number;
  name: string;
  currency: string;
  balance: number;
}

export type AccountInput = Omit<Account, "id">;

export function fetchAccounts(): Promise<Account[]> {
  return apiRequest<Account[]>("/accounts");
}

export function createAccountRequest(data: AccountInput): Promise<Account> {
  return apiRequest<Account>("/accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAccountRequest(id: number, data: AccountInput): Promise<Account> {
  return apiRequest<Account>(`/accounts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteAccountRequest(id: number): Promise<void> {
  return apiRequest<void>(`/accounts/${id}`, { method: "DELETE" });
}
