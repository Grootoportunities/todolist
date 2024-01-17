import { FilterValuesType, TodolistType } from "../App";
import { v1 } from "uuid";

type RemoveTodolistActionType = { type: "REMOVE-TODOLIST"; id: string };
type AddTodolistActionType = { type: "ADD-TODOLIST"; title: string };
export type ChangeTodolistTitleActionType = {
  type: "CHANGE-TODOLIST-TITLE";
  id: string;
  hat: string;
};
export type ChangeTodolistFilterActionType = {
  type: "CHANGE-TODOLIST-FILTER";
  id: string;
  filter: FilterValuesType;
};

type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType;

export const todolistsReducer = (
  state: TodolistType[],
  action: ActionsType,
): TodolistType[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);

    case "ADD-TODOLIST": {
      // const newTodolist = { id: v1(), hat: action.title, filter: "all" };
      return [...state, { id: v1(), hat: action.title, filter: "all" }]; // Почему-то подчёркивает красным если вторым элементом передаю newTodolist
    }

    case "CHANGE-TODOLIST-TITLE":
      return state.map((s) =>
        s.id === action.id ? { ...s, hat: action.hat } : s,
      );

    case "CHANGE-TODOLIST-FILTER":
      return state.map((s) =>
        s.id === action.id ? { ...s, filter: action.filter } : s,
      );

    default:
      throw new Error("I don't understand this type");
  }
};

export const RemoveTodolistAC = (
  todolistID: string,
): RemoveTodolistActionType => ({ type: "REMOVE-TODOLIST", id: todolistID });
export const AddTodolistAC = (
  todolistTitle: string,
): AddTodolistActionType => ({ type: "ADD-TODOLIST", title: todolistTitle });
export const ChangeTodolistTitleAC = (
  todolistID: string,
  newTodolistTitle: string,
): ChangeTodolistTitleActionType => ({
  type: "CHANGE-TODOLIST-TITLE",
  id: todolistID,
  hat: newTodolistTitle,
});
export const ChangeTodolistFilterAC = (
  todolistID: string,
  newFilter: FilterValuesType,
): ChangeTodolistFilterActionType => ({
  type: "CHANGE-TODOLIST-FILTER",
  id: todolistID,
  filter: newFilter,
});
