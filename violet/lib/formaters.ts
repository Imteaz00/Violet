const CURRENCY_FORMATTER = new Intl.NumberFormat("en-BD", {
  currency: "BDT",
  style: "currency",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-BD");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

const DATE_FORMATTER = new Intl.DateTimeFormat(["ban", "id"]);

export function formatDate(date: Date) {
  return DATE_FORMATTER.format(date);
}
