import { configureStore } from "@reduxjs/toolkit";
import { tasksSlice, todolistsSlice } from "features/todolistsList/model";
import { appSlice } from "./model";
import { authSlice } from "features/auth/model";

export const store = configureStore({
  reducer: {
    todolists: todolistsSlice,
    tasks: tasksSlice,
    app: appSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
