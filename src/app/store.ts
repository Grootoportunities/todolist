import { tasksReducer, todolistsReducer } from "../features/todolistsList";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { applicationReducer } from "../features/application";
import { authReducer } from "../features/auth";
import { configureStore, UnknownAction } from "@reduxjs/toolkit";
import { FieldsErrorsType } from "../api/authAPI";

export const store = configureStore({
  reducer: {
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: applicationReducer,
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

export type ThunkAPIConfigType = {
  rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null;
};

// @ts-ignore
window.store = store;
