import { todolistsAPI, TodolistType } from "../../api/todolistsAPI";
import { Dispatch } from "redux";

const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionsType,
): TodolistDomainType[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);

    case "ADD-TODOLIST":
      return [{ ...action.todolist, filter: "all" }, ...state];

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

//ACTIONS

export const removeTodolistAC = (todolistID: string) =>
  ({ type: "REMOVE-TODOLIST", id: todolistID }) as const;

export const addTodolistAC = (todolist: TodolistType) =>
  ({ type: "ADD-TODOLIST", todolist }) as const;

export const changeTodolistTitleAC = (
  todolistID: string,
  newTodolistTitle: string,
) =>
  ({
    type: "CHANGE-TODOLIST-TITLE",
    id: todolistID,
    title: newTodolistTitle,
  }) as const;

export const changeTodolistFilterAC = (
  todolistID: string,
  newFilter: FilterValuesType,
) =>
  ({
    type: "CHANGE-TODOLIST-FILTER",
    id: todolistID,
    filter: newFilter,
  }) as const;

export const setTodolistsAC = (todolists: TodolistType[]) =>
  ({ type: "SET-TODOLISTS", todolists }) as const;

//THUNKS

export const fetchTodolistsTC = () => (dispatch: Dispatch<ActionsType>) =>
  todolistsAPI.getTodolists().then((res) => dispatch(setTodolistsAC(res.data)));

export const deleteTodolistTC =
  (ID: string) => (dispatch: Dispatch<ActionsType>) =>
    todolistsAPI.deleteTodolist(ID).then(() => dispatch(removeTodolistAC(ID)));

export const createTodolistTC =
  (title: string) => (dispatch: Dispatch<ActionsType>) =>
    todolistsAPI
      .createTodolist(title)
      .then((res) => dispatch(addTodolistAC(res.data.data.item)));

export const updateTodolistTitleTC =
  (ID: string, title: string) => (dispatch: Dispatch<ActionsType>) =>
    todolistsAPI
      .updateTodolist(ID, title)
      .then(() => dispatch(changeTodolistTitleAC(ID, title)));

//TYPES

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = { filter: FilterValuesType } & TodolistType;

type ActionsType =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof setTodolistsAC>;
