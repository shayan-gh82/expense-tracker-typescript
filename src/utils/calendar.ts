/** Calendar dates are local dates, not UTC instants. */
export function toLocalInputDate(value: Date = new Date()): string {
  const date = Number.isNaN(value.getTime()) ? new Date() : value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseCalendarDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && toLocalInputDate(date) === value ? date : null;
}

export function nextReminderDate(value: string, frequency: "weekly" | "monthly" | "yearly", fallback: string): string {
  const date = parseCalendarDate(value);
  if (!date) return fallback;
  if (frequency === "weekly") date.setDate(date.getDate() + 7);
  else {
    const day = date.getDate();
    date.setDate(1);
    if (frequency === "monthly") date.setMonth(date.getMonth() + 1);
    else date.setFullYear(date.getFullYear() + 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    date.setDate(Math.min(day, lastDay));
  }
  return toLocalInputDate(date);
}
