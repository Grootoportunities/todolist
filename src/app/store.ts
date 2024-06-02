import { appSlice } from "./index";
import { authSlice } from "../features/auth";
import { configureStore, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { todolistsSlice } from "../features/todolistsList/ui/todolist";
import { tasksSlice } from "../features/todolistsList/ui/todolist/ui/task";

export const store = configureStore({
  reducer: {
    todolists: todolistsSlice,
    tasks: tasksSlice,
    app: appSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

// //TODO Если не ошибаюсь, так описано в документации
// export type AppDispatch = typeof store.dispatch;

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

// @ts-ignore
window.store = store;
