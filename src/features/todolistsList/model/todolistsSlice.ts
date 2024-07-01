import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createAppAsyncThunk,
  handleServerAppError,
  handleServerNetworkError,
} from "common/utils";
import { clearTasksAndTodolists } from "common/actions";
import { ResultCode, StatusesType } from "common/enums";
import { appActions } from "app/model";
import { todolistsAPI, TodolistType } from "../api";
import {
  FilterValuesType,
  TodolistDomainType,
  UpdateTodolistThunk,
} from "./types";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (
      state,
      action: PayloadAction<{
        todolistID: string;
        filter: FilterValuesType;
      }>,
    ) => {
      const index = state.findIndex(
        (tl) => tl.id === action.payload.todolistID,
      );
      if (index !== -1) state[index].filter = action.payload.filter;
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
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, () => {
        return [];
      })
      .addCase(fetchTodolists.fulfilled, (state, action) =>
        action.payload.map((tl) => ({
          ...tl,
          filter: "all",
          entityStatus: StatusesType.IDLE,
        })),
      )
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload);

        if (index !== -1) state.splice(index, 1);
      })
      .addCase(createTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload,
          filter: "all",
          entityStatus: StatusesType.IDLE,
        });
      })
      .addCase(updateTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex(
          (tl) => tl.id === action.payload.todolistID,
        );

        if (index !== -1) state[index].title = action.payload.title;
      });
  },
});

//THUNKS

const fetchTodolists = createAppAsyncThunk<TodolistType[], undefined>(
  `${slice.name}/fetchTodolists`,
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

    try {
      const res = await todolistsAPI.getTodolists();
      dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

      return res.data;
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

const deleteTodolist = createAppAsyncThunk<string, string>(
  `${slice.name}/deleteTodolist`,
  async (todolistID, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
    dispatch(
      todolistsActions.setTodolistEntityStatus({
        todolistID,
        status: StatusesType.LOADING,
      }),
    );

    try {
      const res = await todolistsAPI.deleteTodolist(todolistID);

      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

        return todolistID;
      }

      dispatch(
        todolistsActions.setTodolistEntityStatus({
          todolistID,
          status: StatusesType.FAILED,
        }),
      );

      handleServerAppError(dispatch, res.data);

      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    } catch (err) {
      dispatch(
        todolistsActions.setTodolistEntityStatus({
          todolistID,
          status: StatusesType.FAILED,
        }),
      );

      handleServerNetworkError(err, dispatch);

      return rejectWithValue(null);
    }
  },
);

const createTodolist = createAppAsyncThunk<TodolistType, string>(
  `${slice.name}/createTodolist`,
  async (title, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

    try {
      const res = await todolistsAPI.createTodolist(title);

      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

        return res.data.data.item;
      }

      handleServerAppError(dispatch, res.data, false);
      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

const updateTodolistTitle = createAppAsyncThunk<
  UpdateTodolistThunk,
  UpdateTodolistThunk
>(
  `${slice.name}/updateTodolistTitle`,
  async (arg, { dispatch, rejectWithValue }) => {
    const { todolistID, title } = arg;

    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
    dispatch(
      todolistsActions.setTodolistEntityStatus({
        todolistID,
        status: StatusesType.LOADING,
      }),
    );

    try {
      const res = await todolistsAPI.updateTodolist(arg);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));
        dispatch(
          todolistsActions.setTodolistEntityStatus({
            todolistID,
            status: StatusesType.SUCCEEDED,
          }),
        );

        return { todolistID, title };
      }

      dispatch(
        todolistsActions.setTodolistEntityStatus({
          todolistID,
          status: StatusesType.FAILED,
        }),
      );

      handleServerAppError(dispatch, res.data);

      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    } catch (err) {
      dispatch(
        todolistsActions.setTodolistEntityStatus({
          todolistID,
          status: StatusesType.FAILED,
        }),
      );
      handleServerNetworkError(err, dispatch);

      return rejectWithValue(null);
    }
  },
);

export const todolistsSlice = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = {
  fetchTodolists,
  deleteTodolist,
  createTodolist,
  updateTodolistTitle,
};
