export function formatMoney(value: number, currency = "RUB"): string {
  const sign = currency === "RUB" ? "₽" : currency;
  return `${value.toLocaleString("ru-RU")} ${sign}`;
}
