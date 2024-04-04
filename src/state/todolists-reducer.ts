import { v1 } from "uuid";
import { TodolistType } from "../api/todolistsAPI";

export type RemoveTodolistAT = { type: "REMOVE-TODOLIST"; id: string };

export type AddTodolistAT = {
  type: "ADD-TODOLIST";
  title: string;
  todolistID: string;
};
export type ChangeTodolistTitleAT = {
  type: "CHANGE-TODOLIST-TITLE";
  id: string;
  title: string;
};
export type ChangeTodolistFilterAT = {
  type: "CHANGE-TODOLIST-FILTER";
  id: string;
  filter: FilterValuesType;
};
export type ActionsType =
  | RemoveTodolistAT
  | AddTodolistAT
  | ChangeTodolistTitleAT
  | ChangeTodolistFilterAT;

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = { filter: FilterValuesType } & TodolistType;

const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionsType,
): TodolistDomainType[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);

    case "ADD-TODOLIST": {
      const newTodolist: TodolistDomainType = {
        id: action.todolistID,
        title: action.title,
        filter: "all",
        addedDate: "",
        order: 0,
      };
      return [newTodolist, ...state];
    }

    case "CHANGE-TODOLIST-TITLE":
      return state.map((s) =>
        s.id === action.id ? { ...s, title: action.title } : s,
      );

    case "CHANGE-TODOLIST-FILTER":
      return state.map((s) =>
        s.id === action.id ? { ...s, filter: action.filter } : s,
      );

    default:
      return state;
  }
};

export const removeTodolistAC = (todolistID: string): RemoveTodolistAT => ({
  type: "REMOVE-TODOLIST",
  id: todolistID,
});
export const addTodolistAC = (todolistTitle: string): AddTodolistAT => ({
  type: "ADD-TODOLIST",
  title: todolistTitle,
  todolistID: v1(),
});
export const changeTodolistTitleAC = (
  todolistID: string,
  newTodolistTitle: string,
): ChangeTodolistTitleAT => ({
  type: "CHANGE-TODOLIST-TITLE",
  id: todolistID,
  title: newTodolistTitle,
});
export const changeTodolistFilterAC = (
  todolistID: string,
  newFilter: FilterValuesType,
): ChangeTodolistFilterAT => ({
  type: "CHANGE-TODOLIST-FILTER",
  id: todolistID,
  filter: newFilter,
});
