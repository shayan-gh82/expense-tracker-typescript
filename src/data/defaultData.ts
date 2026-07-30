import type { AuthState, Category, FinanceState, Reminder, Transaction, UISettings, User, Wallet, WalletTransfer } from "../types";

export const DEMO_USER_ID = "user-demo";

export const defaultCategories: Category[] = [
  { id: "cat-food", name: "Food", type: "expense", icon: "Utensils", color: "#FB7185", isDefault: true, userId: null },
  { id: "cat-transport", name: "Transport", type: "expense", icon: "Car", color: "#38BDF8", isDefault: true, userId: null },
  { id: "cat-bills", name: "Bills", type: "expense", icon: "Receipt", color: "#FBBF24", isDefault: true, userId: null },
  { id: "cat-entertainment", name: "Entertainment", type: "expense", icon: "Gamepad2", color: "#A78BFA", isDefault: true, userId: null },
  { id: "cat-shopping", name: "Shopping", type: "expense", icon: "ShoppingBag", color: "#F472B6", isDefault: true, userId: null },
  { id: "cat-health", name: "Health", type: "expense", icon: "HeartPulse", color: "#10B981", isDefault: true, userId: null },
  { id: "cat-education", name: "Education", type: "expense", icon: "GraduationCap", color: "#60A5FA", isDefault: true, userId: null },
  { id: "cat-salary", name: "Salary", type: "income", icon: "Wallet", color: "#34D399", isDefault: true, userId: null },
  { id: "cat-freelance", name: "Freelance", type: "income", icon: "BriefcaseBusiness", color: "#22C55E", isDefault: true, userId: null },
  { id: "cat-gift", name: "Gift", type: "income", icon: "Gift", color: "#C084FC", isDefault: true, userId: null },
];

export const defaultWallets: Wallet[] = [
  {
    id: "wallet-bank",
    userId: DEMO_USER_ID,
    name: "Bank Account",
    type: "bank",
    initialBalance: 25000000,
    icon: "Landmark",
    color: "#7C3AED",
  },
  {
    id: "wallet-cash",
    userId: DEMO_USER_ID,
    name: "Cash Wallet",
    type: "cash",
    initialBalance: 4500000,
    icon: "Banknote",
    color: "#10B981",
  },
  {
    id: "wallet-card",
    userId: DEMO_USER_ID,
    name: "Credit Card",
    type: "card",
    initialBalance: 0,
    icon: "CreditCard",
    color: "#38BDF8",
  },
];

export const defaultTransactions: Transaction[] = [
  {
    id: "trx-1",
    userId: DEMO_USER_ID,
    title: "Monthly salary",
    amount: 32000000,
    type: "income",
    categoryId: "cat-salary",
    walletId: "wallet-bank",
    date: "2026-07-01",
    note: "Main income",
    createdAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "trx-2",
    userId: DEMO_USER_ID,
    title: "Grocery shopping",
    amount: 1850000,
    type: "expense",
    categoryId: "cat-food",
    walletId: "wallet-card",
    date: "2026-07-03",
    note: "Weekly food purchase",
    createdAt: "2026-07-03T12:30:00.000Z",
  },
  {
    id: "trx-3",
    userId: DEMO_USER_ID,
    title: "Internet bill",
    amount: 650000,
    type: "expense",
    categoryId: "cat-bills",
    walletId: "wallet-bank",
    date: "2026-07-05",
    note: "Home internet",
    createdAt: "2026-07-05T08:15:00.000Z",
  },
  {
    id: "trx-4",
    userId: DEMO_USER_ID,
    title: "Freelance landing page",
    amount: 8500000,
    type: "income",
    categoryId: "cat-freelance",
    walletId: "wallet-bank",
    date: "2026-07-06",
    note: "Client project",
    createdAt: "2026-07-06T16:45:00.000Z",
  },
  {
    id: "trx-5",
    userId: DEMO_USER_ID,
    title: "Taxi and metro",
    amount: 420000,
    type: "expense",
    categoryId: "cat-transport",
    walletId: "wallet-cash",
    date: "2026-07-08",
    note: "Transport costs",
    createdAt: "2026-07-08T18:20:00.000Z",
  },
];

export const defaultTransfers: WalletTransfer[] = [
  {
    id: "transfer-1",
    userId: DEMO_USER_ID,
    fromWalletId: "wallet-bank",
    toWalletId: "wallet-cash",
    amount: 2000000,
    date: "2026-07-02",
    note: "Cash withdrawal",
    createdAt: "2026-07-02T10:00:00.000Z",
  },
];

export const defaultReminders: Reminder[] = [
  {
    id: "rem-1",
    userId: DEMO_USER_ID,
    title: "Internet payment",
    amount: 650000,
    type: "expense",
    categoryId: "cat-bills",
    walletId: "wallet-bank",
    frequency: "monthly",
    nextDate: "2026-08-05",
    isActive: true,
    note: "Pay before due date",
    createdAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "rem-2",
    userId: DEMO_USER_ID,
    title: "Gym membership",
    amount: 1200000,
    type: "expense",
    categoryId: "cat-health",
    walletId: "wallet-card",
    frequency: "monthly",
    nextDate: "2026-08-01",
    isActive: true,
    note: "Monthly gym fee",
    createdAt: "2026-07-01T09:00:00.000Z",
  },
];

export const defaultUsers: User[] = [
  {
    id: DEMO_USER_ID,
    name: "Shayan",
    email: "shayan@example.com",
    passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    provider: "local",
    avatarUrl: "",
    createdAt: "2026-07-01T00:00:00.000Z",
  },
];

export const initialFinanceState: FinanceState = {
  transactions: defaultTransactions,
  categories: defaultCategories,
  wallets: defaultWallets,
  transfers: defaultTransfers,
  reminders: defaultReminders,
};

export const initialAuthState: AuthState = {
  users: defaultUsers,
  currentUserId: DEMO_USER_ID,
  provider: "local",
};

export const initialUISettings: UISettings = {
  theme: "dark",
  language: "en",
  currency: "IRR",
  userName: "Shayan",
};
