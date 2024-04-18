import { todolistsAPI, TodolistType } from "../../api/todolistsAPI";
import { Dispatch } from "redux";
import {
  setAppStatusAC,
  SetAppStatusAT,
  StatusesType,
} from "../../app/app-reducer";

const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionsType,
): TodolistDomainType[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);

    case "ADD-TODOLIST":
      return [
        { ...action.todolist, filter: "all", entityStatus: StatusesType.IDLE },
        ...state,
      ];

    case "CHANGE-TODOLIST-TITLE":
      return state.map((s) =>
        s.id === action.id ? { ...s, title: action.title } : s,
      );

    case "CHANGE-TODOLIST-FILTER":
      return state.map((s) =>
        s.id === action.id ? { ...s, filter: action.filter } : s,
      );

    case "CHANGE-TODOLIST-ENTITY-STATUS":
      return state.map((tl) =>
        tl.id === action.todolistID
          ? { ...tl, entityStatus: action.status }
          : tl,
      );

    case "SET-TODOLISTS":
      return action.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: StatusesType.IDLE,
      }));

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

export const setTodolistEntityStatusAC = (
  todolistID: string,
  status: StatusesType,
) =>
  ({
    type: "CHANGE-TODOLIST-ENTITY-STATUS",
    todolistID,
    status,
  }) as const;

//THUNKS

export const fetchTodolistsTC = () => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC(StatusesType.LOADING));
  todolistsAPI.getTodolists().then((res) => {
    dispatch(setTodolistsAC(res.data));
    dispatch(setAppStatusAC(StatusesType.SUCCEEDED));
  });
};

export const deleteTodolistTC =
  (ID: string) => (dispatch: ThunkDispatchType) => {
    dispatch(setAppStatusAC(StatusesType.LOADING));
    dispatch(setTodolistEntityStatusAC(ID, StatusesType.LOADING));
    todolistsAPI.deleteTodolist(ID).then(() => {
      dispatch(removeTodolistAC(ID));
      dispatch(setAppStatusAC(StatusesType.SUCCEEDED));
    });
  };

export const createTodolistTC =
  (title: string) => (dispatch: ThunkDispatchType) => {
    dispatch(setAppStatusAC(StatusesType.LOADING));

    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolistAC(res.data.data.item));
      dispatch(setAppStatusAC(StatusesType.SUCCEEDED));
    });
  };

export const updateTodolistTitleTC =
  (ID: string, title: string) => (dispatch: Dispatch<ActionsType>) =>
    todolistsAPI
      .updateTodolist(ID, title)
      .then(() => dispatch(changeTodolistTitleAC(ID, title)));

//TYPES

type ThunkDispatchType = Dispatch<ActionsType | SetAppStatusAT>;

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = {
  filter: FilterValuesType;
  entityStatus: StatusesType;
} & TodolistType;

type ActionsType =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof setTodolistEntityStatusAC>;
