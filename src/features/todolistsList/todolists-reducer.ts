import { todolistsAPI, TodolistType } from "../../api/todolistsAPI";
import { setAppStatus, StatusesType } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { Dispatch } from "redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ todolistID: string }>) => {
      // state.filter((tl) => tl.id !== action.payload.todolistID);

      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistID,
      );

      if (index !== -1) state.splice(index, 1);
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({
        ...action.payload.todolist,
        filter: "all",
        entityStatus: StatusesType.IDLE,
      });
    },
    changeTodolistTitle: (
      state,
      action: PayloadAction<{ todolistID: string; newTodolistTitle: string }>,
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistID,
      );
      if (index !== -1) state[index].title = action.payload.newTodolistTitle;
    },
    changeTodolistFilter: (
      state,
      action: PayloadAction<{
        todolistID: string;
        newFilter: FilterValuesType;
      }>,
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistID,
      );
      if (index !== -1) state[index].filter = action.payload.newFilter;
    },
    setTodolists: (
      state,
      action: PayloadAction<{ todolists: TodolistType[] }>,
    ) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: StatusesType.IDLE,
      }));
    },
    setTodolistEntityStatus: (
      state,
      action: PayloadAction<{ todolistID: string; status: StatusesType }>,
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistID,
      );
      if (index !== -1) state[index].entityStatus = action.payload.status;
    },
  },
});

export const todolistsReducer = slice.reducer;
export const {
  removeTodolist,
  addTodolist,
  setTodolistEntityStatus,
  setTodolists,
  changeTodolistTitle,
  changeTodolistFilter,
} = slice.actions;

//THUNKS

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: StatusesType.LOADING }));
  todolistsAPI
    .getTodolists()
    .then((res) => {
      dispatch(setTodolists({ todolists: res.data }));
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));
    })
    .catch((err) => handleServerNetworkError(dispatch, err.message));
};

export const deleteTodolistTC = (ID: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: StatusesType.LOADING }));
  dispatch(
    setTodolistEntityStatus({ todolistID: ID, status: StatusesType.LOADING }),
  );
  todolistsAPI
    .deleteTodolist(ID)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(removeTodolist({ todolistID: ID }));
        dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

        return;
      }

      dispatch(
        setTodolistEntityStatus({
          todolistID: ID,
          status: StatusesType.FAILED,
        }),
      );

      handleServerAppError(dispatch, res.data);
    })
    .catch((err) => {
      dispatch(
        setTodolistEntityStatus({
          todolistID: ID,
          status: StatusesType.FAILED,
        }),
      );

      handleServerNetworkError(dispatch, err.message);
    });
};

export const createTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: StatusesType.LOADING }));

  todolistsAPI
    .createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(addTodolist({ todolist: res.data.data.item }));
        dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

        return;
      }

      handleServerAppError(dispatch, res.data);
    })
    .catch((err) => handleServerNetworkError(dispatch, err.message));
};

export const updateTodolistTitleTC =
  (ID: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: StatusesType.LOADING }));
    dispatch(
      setTodolistEntityStatus({ todolistID: ID, status: StatusesType.LOADING }),
    );

    todolistsAPI
      .updateTodolist(ID, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(
            changeTodolistTitle({ todolistID: ID, newTodolistTitle: title }),
          );
          dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));
          dispatch(
            setTodolistEntityStatus({
              todolistID: ID,
              status: StatusesType.SUCCEEDED,
            }),
          );

          return;
        }

        dispatch(
          setTodolistEntityStatus({
            todolistID: ID,
            status: StatusesType.FAILED,
          }),
        );

        handleServerAppError(dispatch, res.data);
      })
      .catch((err) => {
        dispatch(
          setTodolistEntityStatus({
            todolistID: ID,
            status: StatusesType.FAILED,
          }),
        );
        handleServerNetworkError(dispatch, err.message);
      });
  };

//TYPES

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = {
  filter: FilterValuesType;
  entityStatus: StatusesType;
} & TodolistType;
//
// export type TodolistsActionsType =
//   | ReturnType<typeof removeTodolistAC>
//   | ReturnType<typeof addTodolistAC>
//   | ReturnType<typeof changeTodolistTitleAC>
//   | ReturnType<typeof changeTodolistFilterAC>
//   | ReturnType<typeof setTodolistsAC>
//   | ReturnType<typeof setTodolistEntityStatusAC>;
