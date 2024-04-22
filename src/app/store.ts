import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import {
  TasksActionsType,
  tasksReducer,
} from "../features/todolistsList/tasks-reducer";
import {
  TodolistsActionsType,
  todolistsReducer,
} from "../features/todolistsList/todolists-reducer";
import { thunk, ThunkAction, ThunkDispatch } from "redux-thunk";
import { AppActionsType, appReducer } from "./app-reducer";

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = ThunkDispatch<
  RootStateType,
  unknown,
  RootActionsType
>;
type RootActionsType = TodolistsActionsType | TasksActionsType | AppActionsType;
export type AppThunksType<ReturnType = void> = ThunkAction<
  ReturnType,
  RootStateType,
  unknown,
  RootActionsType
>;

// @ts-ignore
window.store = store;
