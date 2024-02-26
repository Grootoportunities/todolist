import { FilterValuesType, TodolistType } from "../AppWithRedux/AppWithRedux";
import { v1 } from "uuid";

export type RemoveTodolistAT = { type: "REMOVE-TODOLIST"; id: string };

export type AddTodolistAT = {
  type: "ADD-TODOLIST";
  title: string;
  todolistID: string;
};
export type ChangeTodolistTitleAT = {
  type: "CHANGE-TODOLIST-TITLE";
  id: string;
  hat: string;
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

const initialState: TodolistType[] = [];

export const todolistsReducer = (
  state: TodolistType[] = initialState,
  action: ActionsType,
): TodolistType[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);

    case "ADD-TODOLIST": {
      const newTodolist: TodolistType = {
        id: action.todolistID,
        hat: action.title,
        filter: "all",
      };
      return [newTodolist, ...state];
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
  hat: newTodolistTitle,
});
export const changeTodolistFilterAC = (
  todolistID: string,
  newFilter: FilterValuesType,
): ChangeTodolistFilterAT => ({
  type: "CHANGE-TODOLIST-FILTER",
  id: todolistID,
  filter: newFilter,
});
