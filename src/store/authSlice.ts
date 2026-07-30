import { createSlice } from "@reduxjs/toolkit";
import { initialAuthState } from "../data/defaultData";

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    registerUser: (state, action) => {
      state.users.push(action.payload);
      state.currentUserId = action.payload.id;
      state.provider = action.payload.provider || "local";
    },
    loginUser: (state, action) => {
      state.currentUserId = action.payload.id;
      state.provider = action.payload.provider || "local";
    },
    upsertGoogleUser: (state, action) => {
      const incoming = action.payload;
      const index = state.users.findIndex(
        (user) => user.id === incoming.id || user.email.toLowerCase() === incoming.email.toLowerCase()
      );

      if (index >= 0) {
        state.users[index] = { ...state.users[index], ...incoming, provider: "google" };
      } else {
        state.users.push({ ...incoming, provider: "google" });
      }

      state.currentUserId = incoming.id;
      state.provider = "google";
    },
    updateCurrentUser: (state, action) => {
      const index = state.users.findIndex((user) => user.id === state.currentUserId);
      if (index >= 0) state.users[index] = { ...state.users[index], ...action.payload };
    },
    logoutUser: (state) => {
      state.currentUserId = null;
      state.provider = null;
    },
  },
});

export const { registerUser, loginUser, upsertGoogleUser, updateCurrentUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
