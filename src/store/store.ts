import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import financeReducer from "./financeSlice";
import { loadPersistedState, savePersistedState } from "./persistence";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    finance: financeReducer,
  },
  preloadedState: loadPersistedState(),
  devTools: import.meta.env.DEV,
});

let persistTimer;
store.subscribe(() => {
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => savePersistedState(store.getState()), 180);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
