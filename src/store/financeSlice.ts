import { createSlice } from "@reduxjs/toolkit";
import { nextReminderDate as getNextReminderDate } from "../utils/calendar";
import {
  DEMO_USER_ID,
  defaultReminders,
  defaultTransactions,
  defaultTransfers,
  defaultWallets,
  initialFinanceState,
} from "../data/defaultData";

const financeSlice = createSlice({
  name: "finance",
  initialState: initialFinanceState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.unshift({
        ...action.payload,
        amount: Number(action.payload.amount),
      });
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...action.payload,
          amount: Number(action.payload.amount),
        };
      }
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter((item) => item.id !== action.payload);
    },
    restoreTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    importTransactions: (state, action) => {
      const imported = action.payload.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
      }));
      state.transactions = [...imported, ...state.transactions];
    },
    addCategory: (state, action) => {
      state.categories.push({ isDefault: false, ...action.payload });
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex((item) => item.id === action.payload.id);
      if (index >= 0 && !state.categories[index].isDefault) {
        state.categories[index] = { ...state.categories[index], ...action.payload };
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((item) => item.id !== action.payload || item.isDefault);
    },
    addWallet: (state, action) => {
      state.wallets.push({
        ...action.payload,
        initialBalance: Number(action.payload.initialBalance),
      });
    },
    updateWallet: (state, action) => {
      const index = state.wallets.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.wallets[index] = {
          ...state.wallets[index],
          ...action.payload,
          initialBalance: Number(action.payload.initialBalance),
        };
      }
    },
    deleteWallet: (state, action) => {
      state.wallets = state.wallets.filter((item) => item.id !== action.payload);
    },
    addTransfer: (state, action) => {
      state.transfers.unshift({
        ...action.payload,
        amount: Number(action.payload.amount),
      });
    },
    deleteTransfer: (state, action) => {
      state.transfers = state.transfers.filter((item) => item.id !== action.payload);
    },
    addReminder: (state, action) => {
      state.reminders.unshift({
        isActive: true,
        ...action.payload,
        amount: Number(action.payload.amount),
      });
    },
    updateReminder: (state, action) => {
      const index = state.reminders.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.reminders[index] = {
          ...state.reminders[index],
          ...action.payload,
          amount: Number(action.payload.amount),
        };
      }
    },
    deleteReminder: (state, action) => {
      state.reminders = state.reminders.filter((item) => item.id !== action.payload);
    },
    toggleReminder: (state, action) => {
      const reminder = state.reminders.find((item) => item.id === action.payload);
      if (reminder) reminder.isActive = !reminder.isActive;
    },
    addReminderAsTransaction: (state, action) => {
      const { reminderId, transaction, paidDate } = action.payload;
      const reminder = state.reminders.find((item) => item.id === reminderId);
      if (!reminder) return;

      state.transactions.unshift({ ...transaction, amount: Number(transaction.amount) });
      reminder.nextDate = getNextReminderDate(reminder.nextDate || paidDate, reminder.frequency, paidDate);
    },
    replaceUserData: (state, action) => {
      const { userId, data } = action.payload;
      state.transactions = [
        ...state.transactions.filter((item) => item.userId !== userId),
        ...(data.transactions || []).map((item) => ({ ...item, userId, amount: Number(item.amount) })),
      ];
      state.wallets = [
        ...state.wallets.filter((item) => item.userId !== userId),
        ...(data.wallets || []).map((item) => ({ ...item, userId, initialBalance: Number(item.initialBalance) })),
      ];
      state.transfers = [
        ...state.transfers.filter((item) => item.userId !== userId),
        ...(data.transfers || []).map((item) => ({ ...item, userId, amount: Number(item.amount) })),
      ];
      state.reminders = [
        ...state.reminders.filter((item) => item.userId !== userId),
        ...(data.reminders || []).map((item) => ({ ...item, userId, amount: Number(item.amount) })),
      ];
      state.categories = [
        ...state.categories.filter((item) => item.isDefault || item.userId !== userId),
        ...(data.categories || [])
          .filter((item) => !item.isDefault)
          .map((item) => ({ ...item, userId, isDefault: false })),
      ];
    },
    resetUserData: (state, action) => {
      const { userId, starterWallet } = action.payload;
      state.transactions = state.transactions.filter((item) => item.userId !== userId);
      state.wallets = state.wallets.filter((item) => item.userId !== userId);
      state.transfers = state.transfers.filter((item) => item.userId !== userId);
      state.reminders = state.reminders.filter((item) => item.userId !== userId);
      state.categories = state.categories.filter((item) => item.isDefault || item.userId !== userId);

      if (userId === DEMO_USER_ID) {
        state.transactions.push(...defaultTransactions);
        state.wallets.push(...defaultWallets);
        state.transfers.push(...defaultTransfers);
        state.reminders.push(...defaultReminders);
      } else if (starterWallet) {
        state.wallets.push(starterWallet);
      }
    },
    ensureStarterWallet: (state, action) => {
      const { userId, wallet } = action.payload;
      if (!state.wallets.some((item) => item.userId === userId) && wallet) {
        state.wallets.push(wallet);
      }
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  restoreTransaction,
  importTransactions,
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
  replaceUserData,
  resetUserData,
  ensureStarterWallet,
} = financeSlice.actions;

export default financeSlice.reducer;
