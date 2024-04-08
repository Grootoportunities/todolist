import { v1 } from "uuid";
import { todolistsAPI, TodolistType } from "../api/todolistsAPI";
import { Dispatch } from "redux";

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

export type SetTodolistsAT = {
  type: "SET-TODOLISTS";
  todolists: TodolistType[];
};

export type ActionsType =
  | RemoveTodolistAT
  | AddTodolistAT
  | ChangeTodolistTitleAT
  | ChangeTodolistFilterAT
  | SetTodolistsAT;

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

    case "SET-TODOLISTS":
      return action.todolists.map((tl) => ({ ...tl, filter: "all" }));

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

export const setTodolistsAC = (todolists: TodolistType[]): SetTodolistsAT => ({
  type: "SET-TODOLISTS",
  todolists,
});

export const fetchTodolistsThunk = (dispatch: Dispatch) =>
  todolistsAPI.getTodolists().then((res) => dispatch(setTodolistsAC(res.data)));
