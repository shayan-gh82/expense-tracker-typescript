import { useDispatch, useSelector } from "react-redux";
import { toLocalInputDate } from "../utils/calendar";
import toast from "react-hot-toast";
import { useUI } from "../context/UIContext";
import { translate } from "../i18n/translations";
import { createId } from "../utils/id";
import { hashPassword } from "../utils/password";
import { signInWithGoogle, signOutGoogle } from "../services/firebaseAuth";
import {
  loginUser as loginUserAction,
  logoutUser as logoutUserAction,
  registerUser as registerUserAction,
  updateCurrentUser,
  upsertGoogleUser,
} from "../store/authSlice";
import {
  addCategory as addCategoryAction,
  addReminder as addReminderAction,
  addReminderAsTransaction as addReminderAsTransactionAction,
  addTransaction as addTransactionAction,
  addTransfer as addTransferAction,
  addWallet as addWalletAction,
  deleteCategory as deleteCategoryAction,
  deleteReminder as deleteReminderAction,
  deleteTransaction as deleteTransactionAction,
  deleteTransfer as deleteTransferAction,
  deleteWallet as deleteWalletAction,
  ensureStarterWallet,
  importTransactions as importTransactionsAction,
  replaceUserData as replaceUserDataAction,
  resetUserData,
  toggleReminder as toggleReminderAction,
  updateCategory as updateCategoryAction,
  updateReminder as updateReminderAction,
  updateTransaction as updateTransactionAction,
  updateWallet as updateWalletAction,
} from "../store/financeSlice";
import {
  selectCategories,
  selectCurrentUser,
  selectExpensesByCategory,
  selectReminders,
  selectTotals,
  selectTransactions,
  selectTransfers,
  selectTrendData,
  selectUpcomingReminders,
  selectUsers,
  selectWalletBalances,
  selectWallets,
} from "../store/selectors";

const nowIso = () => new Date().toISOString();
const todayIso = () => toLocalInputDate();

const createStarterWallet = (userId) => ({
  id: createId("wallet"),
  userId,
  name: "Main Wallet",
  type: "cash",
  initialBalance: 0,
  icon: "Wallet",
  color: "#7C3AED",
  createdAt: nowIso(),
});

const normalizeBackupForUser = ({ data, userId, availableCategories }) => {
  const categoryMap = new Map();
  const walletMap = new Map();
  const defaultCategoryIds = new Set(
    availableCategories.filter((category) => category.isDefault).map((category) => category.id)
  );

  const categories = (data.categories || [])
    .filter((category) => !category.isDefault)
    .map((category) => {
      const id = createId("cat");
      categoryMap.set(category.id, id);
      return {
        ...category,
        id,
        userId,
        isDefault: false,
        createdAt: category.createdAt || nowIso(),
      };
    });

  let wallets = (data.wallets || []).map((wallet) => {
    const id = createId("wallet");
    walletMap.set(wallet.id, id);
    return {
      ...wallet,
      id,
      userId,
      initialBalance: Number(wallet.initialBalance) || 0,
      createdAt: wallet.createdAt || nowIso(),
    };
  });

  if (!wallets.length) {
    const starterWallet = createStarterWallet(userId);
    wallets = [starterWallet];
  }

  const fallbackWalletId = wallets[0].id;
  const resolveCategoryId = (oldId, type) => {
    if (categoryMap.has(oldId)) return categoryMap.get(oldId);
    if (defaultCategoryIds.has(oldId)) return oldId;
    return type === "income" ? "cat-salary" : "cat-food";
  };
  const resolveWalletId = (oldId) => walletMap.get(oldId) || fallbackWalletId;

  const transactions = (data.transactions || []).map((transaction) => ({
    ...transaction,
    id: createId("trx"),
    userId,
    amount: Number(transaction.amount) || 0,
    categoryId: resolveCategoryId(transaction.categoryId, transaction.type),
    walletId: resolveWalletId(transaction.walletId),
    createdAt: transaction.createdAt || nowIso(),
    updatedAt: nowIso(),
  }));

  const transfers = (data.transfers || [])
    .map((transfer) => ({
      ...transfer,
      id: createId("transfer"),
      userId,
      amount: Number(transfer.amount) || 0,
      fromWalletId: resolveWalletId(transfer.fromWalletId),
      toWalletId: resolveWalletId(transfer.toWalletId),
      createdAt: transfer.createdAt || nowIso(),
    }))
    .filter((transfer) => transfer.fromWalletId !== transfer.toWalletId);

  const reminders = (data.reminders || []).map((reminder) => ({
    ...reminder,
    id: createId("rem"),
    userId,
    amount: Number(reminder.amount) || 0,
    categoryId: resolveCategoryId(reminder.categoryId, reminder.type),
    walletId: resolveWalletId(reminder.walletId),
    isActive: reminder.isActive !== false,
    createdAt: reminder.createdAt || nowIso(),
    updatedAt: nowIso(),
  }));

  return { transactions, categories, wallets, transfers, reminders };
};

export const useFinance = () => {
  const dispatch = useDispatch();
  const { settings, updateSettings: updateUISettings } = useUI();
  const users = useSelector(selectUsers);
  const currentUser = useSelector(selectCurrentUser);
  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectCategories);
  const wallets = useSelector(selectWallets);
  const transfers = useSelector(selectTransfers);
  const reminders = useSelector(selectReminders);
  const totals = useSelector(selectTotals);
  const walletBalances = useSelector(selectWalletBalances);
  const expensesByCategory = useSelector(selectExpensesByCategory);
  const trendData = useSelector(selectTrendData);
  const upcomingReminders = useSelector(selectUpcomingReminders);

  const t = (key, values = {}) => translate(settings.language || "en", key, values);
  const currentUserId = currentUser?.id;

  const addTransaction = (payload) => {
    if (!currentUserId) return false;
    dispatch(
      addTransactionAction({
        ...payload,
        id: createId("trx"),
        userId: currentUserId,
        amount: Number(payload.amount),
        createdAt: nowIso(),
      })
    );
    toast.success(t("toast.transactionAdded"));
    return true;
  };

  const updateTransaction = (payload) => {
    dispatch(
      updateTransactionAction({
        ...payload,
        amount: Number(payload.amount),
        userId: currentUserId,
        updatedAt: nowIso(),
      })
    );
    toast.success(t("toast.transactionUpdated"));
  };

  const deleteTransaction = (id) => {
    dispatch(deleteTransactionAction(id));
    toast.success(t("toast.transactionDeleted"));
  };

  const addCategory = (payload) => {
    if (!currentUserId) return false;
    dispatch(
      addCategoryAction({
        ...payload,
        id: createId("cat"),
        userId: currentUserId,
        isDefault: false,
        createdAt: nowIso(),
      })
    );
    toast.success(t("toast.categoryAdded"));
    return true;
  };

  const updateCategory = (payload) => {
    dispatch(
      updateCategoryAction({
        ...payload,
        userId: currentUserId,
        updatedAt: nowIso(),
      })
    );
    toast.success(t("toast.categoryUpdated"));
  };

  const deleteCategory = (id) => {
    const category = categories.find((item) => item.id === id);
    if (category?.isDefault) {
      toast.error(t("errors.defaultCategoryProtected"));
      return false;
    }

    const inUse =
      transactions.some((item) => item.categoryId === id) || reminders.some((item) => item.categoryId === id);
    if (inUse) {
      toast.error(t("errors.categoryInUse"));
      return false;
    }

    dispatch(deleteCategoryAction(id));
    toast.success(t("toast.categoryDeleted"));
    return true;
  };

  const addWallet = (payload) => {
    if (!currentUserId) return false;
    dispatch(
      addWalletAction({
        ...payload,
        id: createId("wallet"),
        userId: currentUserId,
        initialBalance: Number(payload.initialBalance),
        createdAt: nowIso(),
      })
    );
    toast.success(t("toast.walletAdded"));
    return true;
  };

  const updateWallet = (payload) => {
    dispatch(
      updateWalletAction({
        ...payload,
        initialBalance: Number(payload.initialBalance),
        userId: currentUserId,
        updatedAt: nowIso(),
      })
    );
    toast.success(t("toast.walletUpdated"));
  };

  const deleteWallet = (id) => {
    const inUse =
      transactions.some((item) => item.walletId === id) ||
      transfers.some((item) => item.fromWalletId === id || item.toWalletId === id) ||
      reminders.some((item) => item.walletId === id);

    if (inUse) {
      toast.error(t("errors.walletInUse"));
      return false;
    }

    dispatch(deleteWalletAction(id));
    toast.success(t("toast.walletDeleted"));
    return true;
  };

  const addTransfer = (payload) => {
    const amount = Number(payload.amount);
    if (payload.fromWalletId === payload.toWalletId) {
      toast.error(t("errors.differentWallets"));
      return false;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error(t("errors.transferAmountPositive"));
      return false;
    }

    const source = walletBalances.find((wallet) => wallet.id === payload.fromWalletId);
    if (!source || source.balance < amount) {
      toast.error(t("errors.insufficientBalance"));
      return false;
    }

    dispatch(
      addTransferAction({
        ...payload,
        id: createId("transfer"),
        userId: currentUserId,
        amount,
        createdAt: nowIso(),
      })
    );
    toast.success(t("toast.transferAdded"));
    return true;
  };

  const deleteTransfer = (id) => {
    dispatch(deleteTransferAction(id));
    toast.success(t("toast.transferDeleted"));
  };

  const addReminder = (payload) => {
    if (!currentUserId) return false;
    dispatch(
      addReminderAction({
        ...payload,
        id: createId("rem"),
        userId: currentUserId,
        amount: Number(payload.amount),
        isActive: true,
        createdAt: nowIso(),
      })
    );
    toast.success(t("toast.reminderAdded"));
    return true;
  };

  const updateReminder = (payload) => {
    dispatch(
      updateReminderAction({
        ...payload,
        amount: Number(payload.amount),
        userId: currentUserId,
        updatedAt: nowIso(),
      })
    );
    toast.success(t("toast.reminderUpdated"));
  };

  const deleteReminder = (id) => {
    dispatch(deleteReminderAction(id));
    toast.success(t("toast.reminderDeleted"));
  };

  const toggleReminder = (id) => dispatch(toggleReminderAction(id));

  const addReminderAsTransaction = (id) => {
    const reminder = reminders.find((item) => item.id === id);
    if (!reminder || !currentUserId) return false;

    const paidDate = todayIso();
    dispatch(
      addReminderAsTransactionAction({
        reminderId: id,
        paidDate,
        transaction: {
          id: createId("trx"),
          userId: currentUserId,
          title: reminder.title,
          amount: Number(reminder.amount),
          type: reminder.type,
          categoryId: reminder.categoryId,
          walletId: reminder.walletId,
          date: paidDate,
          note: reminder.note || "Created from reminder",
          createdAt: nowIso(),
        },
      })
    );
    toast.success(t("toast.reminderConverted"));
    return true;
  };

  const importTransactions = (payload) => {
    if (!currentUserId) return false;
    const normalized = payload.map((item) => ({
      ...item,
      id: createId("trx"),
      amount: Number(item.amount),
      userId: currentUserId,
      createdAt: nowIso(),
    }));
    dispatch(importTransactionsAction(normalized));
    toast.success(t("toast.transactionsImported", { count: normalized.length }));
    return true;
  };

  const replaceUserData = (data) => {
    if (!currentUserId) return false;
    const normalized = normalizeBackupForUser({ data, userId: currentUserId, availableCategories: categories });
    dispatch(replaceUserDataAction({ userId: currentUserId, data: normalized }));
    toast.success(t("toast.backupImported"));
    return true;
  };

  const registerUser = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some((user) => user.email.toLowerCase() === normalizedEmail);
    if (exists) {
      toast.error(t("toast.emailExists"));
      return false;
    }

    const user = {
      id: createId("user"),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      provider: "local",
      avatarUrl: "",
      createdAt: nowIso(),
    };

    dispatch(registerUserAction(user));
    dispatch(ensureStarterWallet({ userId: user.id, wallet: createStarterWallet(user.id) }));
    updateUISettings({ userName: user.name });
    toast.success(t("toast.accountCreated"));
    return true;
  };

  const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!user) {
      toast.error(t("toast.invalidLogin"));
      return false;
    }

    const passwordHash = await hashPassword(password);
    const valid = user.passwordHash ? user.passwordHash === passwordHash : user.password === password;
    if (!valid) {
      toast.error(t("toast.invalidLogin"));
      return false;
    }

    dispatch(loginUserAction({ id: user.id, provider: user.provider || "local" }));
    dispatch(ensureStarterWallet({ userId: user.id, wallet: createStarterWallet(user.id) }));
    if (!user.passwordHash) dispatch(updateCurrentUser({ passwordHash, password: undefined }));
    updateUISettings({ userName: user.name });
    toast.success(t("toast.loggedIn"));
    return true;
  };

  const loginWithGoogle = async () => {
    try {
      const profile = await signInWithGoogle();
      const existing = users.find((user) => user.email.toLowerCase() === profile.email.toLowerCase());
      const user = { ...profile, id: existing?.id || profile.id };
      dispatch(upsertGoogleUser(user));
      dispatch(ensureStarterWallet({ userId: user.id, wallet: createStarterWallet(user.id) }));
      updateUISettings({ userName: user.name });
      toast.success(t("toast.googleLoginSuccess"));
      return true;
    } catch (error) {
      console.error(error);
      if (error?.message === "FIREBASE_NOT_CONFIGURED") {
        toast.error(t("errors.firebaseNotConfigured"));
      } else if (error?.code !== "auth/popup-closed-by-user") {
        toast.error(t("errors.googleLoginFailed"));
      }
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      if (currentUser?.provider === "google") await signOutGoogle();
    } catch (error) {
      console.error("Google sign out failed", error);
    } finally {
      dispatch(logoutUserAction());
      toast.success(t("toast.loggedOut"));
    }
  };

  const updateSettings = (payload) => {
    updateUISettings(payload);
    if (payload.userName && currentUser) {
      dispatch(updateCurrentUser({ name: payload.userName.trim(), updatedAt: nowIso() }));
    }
    toast.success(t("toast.settingsUpdated"));
  };

  const resetData = () => {
    if (!currentUserId) return;
    dispatch(
      resetUserData({
        userId: currentUserId,
        starterWallet: createStarterWallet(currentUserId),
      })
    );
    toast.success(t("toast.demoRestored"));
  };

  return {
    users,
    currentUser,
    currentUserId,
    transactions,
    categories,
    wallets,
    transfers,
    reminders,
    totals,
    walletBalances,
    expensesByCategory,
    trendData,
    upcomingReminders,
    settings,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addWallet,
    updateWallet,
    deleteWallet,
    addTransfer,
    deleteTransfer,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    addReminderAsTransaction,
    importTransactions,
    replaceUserData,
    registerUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateSettings,
    resetData,
  };
};
