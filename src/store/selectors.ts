import { createSelector } from "@reduxjs/toolkit";
import {
  getAllWalletBalances,
  getExpenseByCategory,
  getIncomeExpenseTrend,
  getTransactionTotals,
  getUpcomingReminders,
} from "../utils/calculations";
import type { RootState } from "./store";

export const selectAuth = (state: RootState) => state.auth;
export const selectFinance = (state: RootState) => state.finance;
export const selectCurrentUserId = (state: RootState) => state.auth.currentUserId;

export const selectCurrentUser = createSelector(
  [selectAuth],
  (auth) => auth.users.find((user) => user.id === auth.currentUserId) || null
);

export const selectUsers = createSelector([selectAuth], (auth) => auth.users);

export const selectTransactions = createSelector(
  [selectFinance, selectCurrentUserId],
  (finance, userId) => (userId ? finance.transactions.filter((item) => item.userId === userId) : [])
);

export const selectCategories = createSelector(
  [selectFinance, selectCurrentUserId],
  (finance, userId) => finance.categories.filter((item) => item.isDefault || item.userId === userId)
);

export const selectWallets = createSelector(
  [selectFinance, selectCurrentUserId],
  (finance, userId) => (userId ? finance.wallets.filter((item) => item.userId === userId) : [])
);

export const selectTransfers = createSelector(
  [selectFinance, selectCurrentUserId],
  (finance, userId) => (userId ? finance.transfers.filter((item) => item.userId === userId) : [])
);

export const selectReminders = createSelector(
  [selectFinance, selectCurrentUserId],
  (finance, userId) => (userId ? finance.reminders.filter((item) => item.userId === userId) : [])
);

export const selectTotals = createSelector([selectTransactions], getTransactionTotals);

export const selectWalletBalances = createSelector(
  [selectWallets, selectTransactions, selectTransfers],
  getAllWalletBalances
);

export const selectExpensesByCategory = createSelector(
  [selectTransactions, selectCategories],
  getExpenseByCategory
);

export const selectTrendData = createSelector([selectTransactions], getIncomeExpenseTrend);
export const selectUpcomingReminders = createSelector([selectReminders], getUpcomingReminders);
