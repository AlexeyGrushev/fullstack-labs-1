export interface Account {
  id: number;
  name: string;
  currency: string;
  balance: number;
}

export const mockAccounts: Account[] = [
  { id: 1, name: "Основная карта", currency: "RUB", balance: 54200 },
  { id: 2, name: "Наличные", currency: "RUB", balance: 3100 },
  { id: 3, name: "Накопительный счёт", currency: "RUB", balance: 128000 },
];

export function nextAccountId(accounts: Account[]): number {
  return Math.max(0, ...accounts.map((a) => a.id)) + 1;
}
