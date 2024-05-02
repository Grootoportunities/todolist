import { tasksReducer } from "../features/todolistsList/tasks-reducer";
import { todolistsReducer } from "../features/todolistsList/todolists-reducer";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "../features/login/auth-reducer";
import { configureStore, UnknownAction } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = ThunkDispatch<
  RootStateType,
  unknown,
  UnknownAction
>;
export type AppThunksType<ReturnType = void> = ThunkAction<
  ReturnType,
  RootStateType,
  unknown,
  UnknownAction
>;

// @ts-ignore
window.store = store;
