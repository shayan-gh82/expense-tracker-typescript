export type TransactionType = "income" | "expense";
export type CategoryType = TransactionType | "both";
export type WalletType = "bank" | "cash" | "card" | "credit" | "other";
export type ReminderFrequency = "weekly" | "monthly" | "yearly";
export type AuthProvider = "local" | "google";
export type ThemeMode = "light" | "dark";
export type LanguageCode = "en" | "fa";
export type ReminderStatus = "paused" | "invalid" | "overdue" | "dueToday" | "upcoming";

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  walletId: string;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  isDefault: boolean;
  userId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  type: WalletType;
  initialBalance: number;
  icon?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WalletTransfer {
  id: string;
  userId: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  walletId: string;
  frequency: ReminderFrequency;
  nextDate: string;
  isActive: boolean;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReminderWithStatus extends Reminder {
  status: ReminderStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  password?: string;
  provider: AuthProvider;
  avatarUrl?: string;
  createdAt: string;
}

export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
  transfers: WalletTransfer[];
  reminders: Reminder[];
}

export interface AuthState {
  users: User[];
  currentUserId: string | null;
  provider: AuthProvider | null;
}

export interface UISettings {
  theme: ThemeMode;
  language: LanguageCode;
  currency: string;
  userName: string;
}

export interface TransactionTotals {
  income: number;
  expense: number;
  balance: number;
}

export interface WalletWithBalance extends Wallet {
  balance: number;
}

export interface ExpenseCategoryPoint {
  categoryId: string;
  name: string;
  color: string;
  amount: number;
}

export interface TrendPoint {
  date: string;
  income: number;
  expense: number;
}

export interface TransactionFilters {
  search?: string;
  type?: "all" | TransactionType;
  categoryId?: string;
  walletId?: string;
  minAmount?: number | string;
  maxAmount?: number | string;
  startDate?: string;
  endDate?: string;
}

export interface UserBackupData {
  transactions?: Transaction[];
  categories?: Category[];
  wallets?: Wallet[];
  transfers?: WalletTransfer[];
  reminders?: Reminder[];
}
