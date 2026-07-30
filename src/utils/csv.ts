import type { Category, Transaction, TransactionType, Wallet } from "../types";

type CsvRow = Record<string, string>;

export interface CsvInvalidRow {
  row: number;
  reason: string;
}

export interface ImportedTransaction {
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  walletId: string;
  date: string;
  note: string;
}

const escapeCsvValue = (value: unknown): string => {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\n") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && insideQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
};

const normalizeText = (value: unknown): string => String(value || "").trim();
const normalizeName = (value: unknown): string => normalizeText(value).toLocaleLowerCase();

const isValidDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
};

export const exportTransactionsToCsv = (
  transactions: Transaction[],
  categories: Category[],
  wallets: Wallet[],
  fileName = "expense-tracker-transactions"
): void => {
  const header = ["title", "amount", "type", "category", "wallet", "date", "note"];

  const rows = transactions.map((transaction) => {
    const category = categories.find((item) => item.id === transaction.categoryId);
    const wallet = wallets.find((item) => item.id === transaction.walletId);

    return [
      transaction.title,
      transaction.amount,
      transaction.type,
      category?.name || "",
      wallet?.name || "",
      transaction.date,
      transaction.note || "",
    ].map(escapeCsvValue);
  });

  const csv = `\uFEFF${[header.join(","), ...rows.map((row) => row.join(","))].join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${fileName}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const parseTransactionsCsv = (
  csvText: string,
  categories: Category[],
  wallets: Wallet[]
): { valid: ImportedTransaction[]; invalid: CsvInvalidRow[] } => {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return { valid: [], invalid: [{ row: 1, reason: "EMPTY_FILE" }] };

  const header = parseCsvLine(lines[0]).map((column) => normalizeName(column));
  const requiredHeaders = ["title", "amount", "type", "category", "wallet", "date"];
  const missingHeaders = requiredHeaders.filter((column) => !header.includes(column));

  if (missingHeaders.length) {
    return {
      valid: [],
      invalid: [{ row: 1, reason: `MISSING_HEADERS:${missingHeaders.join("|")}` }],
    };
  }

  const valid: ImportedTransaction[] = [];
  const invalid: CsvInvalidRow[] = [];

  lines.slice(1).forEach((line, rowIndex) => {
    const values = parseCsvLine(line);
    const row = header.reduce<CsvRow>((result, key, index) => {
      result[key] = normalizeText(values[index]);
      return result;
    }, {});

    const amount = Number(String(row.amount).replace(/,/g, ""));
    const type = normalizeName(row.type) as TransactionType;
    const rowNumber = rowIndex + 2;

    if (!row.title) {
      invalid.push({ row: rowNumber, reason: "TITLE_REQUIRED" });
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      invalid.push({ row: rowNumber, reason: "INVALID_AMOUNT" });
      return;
    }
    if (!["income", "expense"].includes(type)) {
      invalid.push({ row: rowNumber, reason: "INVALID_TYPE" });
      return;
    }
    if (!isValidDate(row.date)) {
      invalid.push({ row: rowNumber, reason: "INVALID_DATE" });
      return;
    }

    const category = categories.find(
      (item) => item.type === type && normalizeName(item.name) === normalizeName(row.category)
    );
    const wallet = wallets.find((item) => normalizeName(item.name) === normalizeName(row.wallet));

    if (!category) {
      invalid.push({ row: rowNumber, reason: "UNKNOWN_CATEGORY" });
      return;
    }
    if (!wallet) {
      invalid.push({ row: rowNumber, reason: "UNKNOWN_WALLET" });
      return;
    }

    valid.push({
      title: row.title,
      amount,
      type,
      categoryId: category.id,
      walletId: wallet.id,
      date: row.date,
      note: row.note || "Imported from CSV",
    });
  });

  return { valid, invalid };
};

export const removeDuplicateTransactions = <T extends ImportedTransaction>(incoming: T[], existing: Transaction[]): T[] => {
  const fingerprints = new Set(
    existing.map((item) =>
      [item.title.trim().toLowerCase(), Number(item.amount), item.type, item.categoryId, item.walletId, item.date].join("|")
    )
  );

  return incoming.filter((item) => {
    const fingerprint = [
      item.title.trim().toLowerCase(),
      Number(item.amount),
      item.type,
      item.categoryId,
      item.walletId,
      item.date,
    ].join("|");

    if (fingerprints.has(fingerprint)) return false;
    fingerprints.add(fingerprint);
    return true;
  });
};
