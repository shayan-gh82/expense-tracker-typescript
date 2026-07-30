import {
  DEMO_USER_ID,
  defaultCategories,
  initialAuthState,
  initialFinanceState,
} from "../data/defaultData";

export const REDUX_STORAGE_KEY = "expense-tracker-pro-redux-v1";
const OLD_STORAGE_KEYS = ["expense-tracker-pro-state-v2", "expense-tracker-pro-state"];
const DEFAULT_CATEGORY_IDS = new Set(defaultCategories.map((item) => item.id));

const safeArray = (value, fallback = []) => (Array.isArray(value) ? value : fallback);

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name || "User",
  email: user.email || "",
  passwordHash: user.passwordHash,
  // Kept only for backward compatibility with the previous local demo version.
  password: user.password,
  provider: user.provider || "local",
  avatarUrl: user.avatarUrl || "",
  createdAt: user.createdAt || new Date().toISOString(),
});

const migrateLegacyState = (legacy) => {
  const currentUserId = legacy.currentUserId || legacy.users?.[0]?.id || DEMO_USER_ID;
  const users = safeArray(legacy.users, initialAuthState.users).map(normalizeUser);

  return {
    auth: {
      users,
      currentUserId,
      provider: "local",
    },
    finance: {
      transactions: safeArray(legacy.transactions, initialFinanceState.transactions).map((item) => ({
        ...item,
        userId: item.userId || currentUserId,
      })),
      categories: safeArray(legacy.categories, initialFinanceState.categories).map((item) => ({
        ...item,
        isDefault: item.isDefault ?? DEFAULT_CATEGORY_IDS.has(item.id),
        userId: DEFAULT_CATEGORY_IDS.has(item.id) ? null : item.userId || currentUserId,
      })),
      wallets: safeArray(legacy.wallets, initialFinanceState.wallets).map((item) => ({
        ...item,
        userId: item.userId || currentUserId,
      })),
      transfers: safeArray(legacy.transfers, initialFinanceState.transfers).map((item) => ({
        ...item,
        userId: item.userId || currentUserId,
      })),
      reminders: safeArray(legacy.reminders, initialFinanceState.reminders).map((item) => ({
        ...item,
        userId: item.userId || currentUserId,
      })),
    },
  };
};

const mergeReduxState = (saved) => ({
  auth: {
    ...initialAuthState,
    ...(saved.auth || {}),
    users: safeArray(saved.auth?.users, initialAuthState.users).map(normalizeUser),
  },
  finance: {
    ...initialFinanceState,
    ...(saved.finance || {}),
    transactions: safeArray(saved.finance?.transactions, initialFinanceState.transactions),
    categories: safeArray(saved.finance?.categories, initialFinanceState.categories),
    wallets: safeArray(saved.finance?.wallets, initialFinanceState.wallets),
    transfers: safeArray(saved.finance?.transfers, initialFinanceState.transfers),
    reminders: safeArray(saved.finance?.reminders, initialFinanceState.reminders),
  },
});

export const loadPersistedState = () => {
  try {
    const current = localStorage.getItem(REDUX_STORAGE_KEY);
    if (current) return mergeReduxState(JSON.parse(current));

    for (const key of OLD_STORAGE_KEYS) {
      const legacy = localStorage.getItem(key);
      if (legacy) return migrateLegacyState(JSON.parse(legacy));
    }
  } catch (error) {
    console.error("Failed to load persisted Redux state", error);
  }

  return undefined;
};

export const savePersistedState = (state) => {
  try {
    localStorage.setItem(
      REDUX_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        auth: state.auth,
        finance: state.finance,
      })
    );
  } catch (error) {
    console.error("Failed to persist Redux state", error);
  }
};
