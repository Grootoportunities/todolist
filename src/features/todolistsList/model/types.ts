import { StatusesType } from "common/enums";
import { TodolistType } from "../api";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = {
  filter: FilterValuesType;
  entityStatus: StatusesType;
} & TodolistType;
export type UpdateTodolistThunk = {
  todolistID: string;
  title: string;
};
export type DeleteTaskThunk = { todolistID: string; taskID: string };
export type UpdateTaskThunk<T> = {
  todolistID: string;
  taskID: string;
  model: T;
};
