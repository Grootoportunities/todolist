import { todolistsAPI, TodolistType } from "../api/todolistsAPI";
import { Dispatch } from "redux";

export type RemoveTodolistAT = { type: "REMOVE-TODOLIST"; id: string };

export type AddTodolistAT = {
  type: "ADD-TODOLIST";
  todolist: TodolistType;
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
      return [{ ...action.todolist, filter: "all" }, ...state];
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
export const addTodolistAC = (todolist: TodolistType): AddTodolistAT => ({
  type: "ADD-TODOLIST",
  todolist,
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

//THUNK

export const fetchTodolistsTC = () => (dispatch: Dispatch) =>
  todolistsAPI.getTodolists().then((res) => dispatch(setTodolistsAC(res.data)));

export const deleteTodolistTC = (ID: string) => (dispatch: Dispatch) =>
  todolistsAPI.deleteTodolist(ID).then(() => dispatch(removeTodolistAC(ID)));

export const createTodolistTC = (title: string) => (dispatch: Dispatch) =>
  todolistsAPI
    .createTodolist(title)
    .then((res) => dispatch(addTodolistAC(res.data.data.item)));

export const updateTodolistTitleTC =
  (ID: string, title: string) => (dispatch: Dispatch) =>
    todolistsAPI
      .updateTodolist(ID, title)
      .then(() => dispatch(changeTodolistTitleAC(ID, title)));
