export const MONTH_LABELS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
] as const;

export type Period = { month: number; year: number };

export function getSelectedPeriod(searchParams: {
  month?: string;
  year?: string;
}): Period {
  const now = new Date();
  const month = Number(searchParams.month ?? now.getMonth() + 1);
  const year = Number(searchParams.year ?? now.getFullYear());

  const validMonth = Number.isInteger(month) && month >= 1 && month <= 12 ? month : now.getMonth() + 1;
  const validYear = Number.isInteger(year) && year > 1900 ? year : now.getFullYear();

  return { month: validMonth, year: validYear };
}

/** Intervalo [start, end) do mês, em UTC, para uso em filtros de data no Prisma. */
export function getMonthRange({ month, year }: Period) {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return { start, end };
}

/** Intervalo [start, end) do mês até uma data limite (fim do próprio mês). Usado no saldo do Balanço. */
export function getUpToMonthEndRange({ month, year }: Period) {
  const end = new Date(Date.UTC(year, month, 1));
  return { end };
}

export function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDateRangeLabel({ month, year }: Period) {
  const { start, end } = getMonthRange({ month, year });
  const lastDay = new Date(end.getTime() - 1);
  const fmt = (d: Date) =>
    `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCFullYear()).slice(2)}`;
  return `${fmt(start)} a ${fmt(lastDay)}`;
}
