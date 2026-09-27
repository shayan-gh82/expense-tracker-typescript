import { parseCalendarDate, toLocalInputDate } from "./calendar";

const getCurrentLocale = (): string => {
  if (typeof document !== "undefined" && document.documentElement.lang === "fa") return "fa-IR";
  return "en-US";
};

export const formatCurrency = (amount: number | string, currency = "IRR"): string => {
  const safeAmount = Number(amount) || 0;
  const locale = getCurrentLocale();

  if (currency === "IRR") {
    return `${new Intl.NumberFormat(locale).format(safeAmount)} IRR`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(safeAmount);
};

export const formatCompactCurrency = (amount: number | string, currency = "IRR"): string => {
  const safeAmount = Number(amount) || 0;
  const locale = getCurrentLocale();
  const suffix = currency === "IRR" ? " IRR" : ` ${currency}`;

  if (Math.abs(safeAmount) >= 1_000_000_000) return `${new Intl.NumberFormat(locale).format(Number((safeAmount / 1_000_000_000).toFixed(1)))}B${suffix}`;
  if (Math.abs(safeAmount) >= 1_000_000) return `${new Intl.NumberFormat(locale).format(Number((safeAmount / 1_000_000).toFixed(1)))}M${suffix}`;
  if (Math.abs(safeAmount) >= 1_000) return `${new Intl.NumberFormat(locale).format(Number((safeAmount / 1_000).toFixed(1)))}K${suffix}`;

  return `${new Intl.NumberFormat(locale).format(safeAmount)}${suffix}`;
};

export const formatDate = (date: Date | string, locale = getCurrentLocale()): string => {
  if (!date) return "-";
  const parsedDate = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? parseCalendarDate(date) ?? new Date(NaN)
    : new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(parsedDate);
};

export const toInputDate = (date: Date | string = new Date()): string => {
  if (typeof date === "string" && parseCalendarDate(date)) return date;
  const current = new Date(date);
  return toLocalInputDate(current);
};

export const capitalize = (value: string): string => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};
