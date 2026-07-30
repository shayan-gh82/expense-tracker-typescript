import type {
  Category,
  ExpenseCategoryPoint,
  Reminder,
  ReminderStatus,
  ReminderWithStatus,
  Transaction,
  TransactionFilters,
  TransactionTotals,
  TrendPoint,
  Wallet,
  WalletTransfer,
  WalletWithBalance,
} from "../types";

export const getTransactionTotals = (transactions: Transaction[] = []): TransactionTotals =>
  transactions.reduce<TransactionTotals>(
    (totals, transaction) => {
      const amount = Number(transaction.amount) || 0;
      if (transaction.type === "income") totals.income += amount;
      if (transaction.type === "expense") totals.expense += amount;
      totals.balance = totals.income - totals.expense;
      return totals;
    },
    { income: 0, expense: 0, balance: 0 }
  );

export const getWalletBalance = (
  walletId: string,
  wallets: Wallet[] = [],
  transactions: Transaction[] = [],
  transfers: WalletTransfer[] = []
): number => {
  const wallet = wallets.find((item) => item.id === walletId);
  const initialBalance = Number(wallet?.initialBalance) || 0;

  const transactionEffect = transactions.reduce((total, transaction) => {
    if (transaction.walletId !== walletId) return total;
    const amount = Number(transaction.amount) || 0;
    return transaction.type === "income" ? total + amount : total - amount;
  }, 0);

  const transferEffect = transfers.reduce((total, transfer) => {
    const amount = Number(transfer.amount) || 0;
    if (transfer.fromWalletId === walletId) return total - amount;
    if (transfer.toWalletId === walletId) return total + amount;
    return total;
  }, 0);

  return initialBalance + transactionEffect + transferEffect;
};

export const getAllWalletBalances = (
  wallets: Wallet[] = [],
  transactions: Transaction[] = [],
  transfers: WalletTransfer[] = []
): WalletWithBalance[] =>
  wallets.map((wallet) => ({
    ...wallet,
    balance: getWalletBalance(wallet.id, wallets, transactions, transfers),
  }));

export const getExpenseByCategory = (
  transactions: Transaction[] = [],
  categories: Category[] = []
): ExpenseCategoryPoint[] => {
  const grouped = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<string, ExpenseCategoryPoint>>((result, transaction) => {
      const category = categories.find((item) => item.id === transaction.categoryId);
      const key = transaction.categoryId || "unknown";

      if (!result[key]) {
        result[key] = {
          categoryId: key,
          name: category?.name || "Unknown",
          color: category?.color || "#C084FC",
          amount: 0,
        };
      }

      result[key].amount += Number(transaction.amount) || 0;
      return result;
    }, {});

  return Object.values(grouped).sort((a, b) => b.amount - a.amount);
};

export const getIncomeExpenseTrend = (transactions: Transaction[] = []): TrendPoint[] => {
  const grouped = transactions.reduce<Record<string, TrendPoint>>((result, transaction) => {
    const date = transaction.date;
    if (!date) return result;

    if (!result[date]) result[date] = { date, income: 0, expense: 0 };

    const amount = Number(transaction.amount) || 0;
    if (transaction.type === "income") result[date].income += amount;
    if (transaction.type === "expense") result[date].expense += amount;
    return result;
  }, {});

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
};

const toLocalDateOnly = (date: Date | string = new Date()): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

export const getReminderStatus = (reminder: Reminder, now: Date = new Date()): ReminderStatus => {
  if (!reminder.isActive) return "paused";

  const dueDate = toLocalDateOnly(`${reminder.nextDate}T00:00:00`);
  const today = toLocalDateOnly(now);

  if (Number.isNaN(dueDate.getTime())) return "invalid";
  if (dueDate < today) return "overdue";
  if (dueDate.getTime() === today.getTime()) return "dueToday";
  return "upcoming";
};

export const getUpcomingReminders = (reminders: Reminder[] = [], days = 14): ReminderWithStatus[] => {
  const today = toLocalDateOnly();
  const limit = new Date(today);
  limit.setDate(limit.getDate() + days);

  return reminders
    .filter((reminder) => reminder.isActive)
    .filter((reminder) => {
      const nextDate = toLocalDateOnly(`${reminder.nextDate}T00:00:00`);
      return !Number.isNaN(nextDate.getTime()) && nextDate <= limit;
    })
    .map((reminder) => ({ ...reminder, status: getReminderStatus(reminder, today) }))
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate));
};

export const filterTransactions = (
  transactions: Transaction[] = [],
  filters: TransactionFilters = {}
): Transaction[] => {
  const {
    search = "",
    type = "all",
    categoryId = "all",
    walletId = "all",
    minAmount = "",
    maxAmount = "",
    startDate = "",
    endDate = "",
  } = filters;

  const query = String(search).toLowerCase().trim();

  return transactions.filter((transaction) => {
    const amount = Number(transaction.amount) || 0;
    const searchMatch =
      !query ||
      String(transaction.title || "").toLowerCase().includes(query) ||
      String(amount).includes(query);
    const typeMatch = type === "all" || transaction.type === type;
    const categoryMatch = categoryId === "all" || transaction.categoryId === categoryId;
    const walletMatch = walletId === "all" || transaction.walletId === walletId;
    const minMatch = minAmount === "" || amount >= Number(minAmount);
    const maxMatch = maxAmount === "" || amount <= Number(maxAmount);
    const startMatch = !startDate || transaction.date >= startDate;
    const endMatch = !endDate || transaction.date <= endDate;

    return searchMatch && typeMatch && categoryMatch && walletMatch && minMatch && maxMatch && startMatch && endMatch;
  });
};
