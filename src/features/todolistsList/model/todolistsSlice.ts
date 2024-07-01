import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { clearTasksAndTodolists } from "common/actions";
import { ResultCode, StatusesType } from "common/enums";
import { FieldsErrorsType } from "features/auth/api";
import { todolistsAPI, TodolistType } from "../api";
import { appActions } from "app/model";
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  FilterValuesType,
  TodolistDomainType,
  UpdateTodolistThunk,
} from "./types";

const createTodolistsSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createTodolistsSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: (creators) => {
    const createAppThunk = creators.asyncThunk.withTypes<{
      rejectValue: {
        errors: string[];
        fieldsErrors: FieldsErrorsType[];
      } | null;
    }>();

    return {
      changeTodolistFilter: creators.reducer(
        (
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
      ),
      setTodolistEntityStatus: creators.reducer(
        (
          state,
          action: PayloadAction<{ todolistID: string; status: StatusesType }>,
        ) => {
          const index = state.findIndex(
            (tl) => tl.id === action.payload.todolistID,
          );
          if (index !== -1) state[index].entityStatus = action.payload.status;
        },
      ),
      fetchTodolists: createAppThunk<TodolistType[], undefined>(
        async (_, { dispatch, rejectWithValue }) => {
          dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

          try {
            const res = await todolistsAPI.getTodolists();
            dispatch(
              appActions.setAppStatus({ status: StatusesType.SUCCEEDED }),
            );

            return res.data;
          } catch (err) {
            handleServerNetworkError(err, dispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) =>
            action.payload.map((tl) => ({
              ...tl,
              filter: "all",
              entityStatus: StatusesType.IDLE,
            })),
        },
      ),
      deleteTodolist: createAppThunk<string, string>(
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
              dispatch(
                appActions.setAppStatus({ status: StatusesType.SUCCEEDED }),
              );

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
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((tl) => tl.id === action.payload);

            if (index !== -1) state.splice(index, 1);
          },
        },
      ),
      createTodolist: createAppThunk<TodolistType, string>(
        async (title, { dispatch, rejectWithValue }) => {
          dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

          try {
            const res = await todolistsAPI.createTodolist(title);

            if (res.data.resultCode === ResultCode.Success) {
              dispatch(
                appActions.setAppStatus({ status: StatusesType.SUCCEEDED }),
              );

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
        {
          fulfilled: (state, action) => {
            state.unshift({
              ...action.payload,
              filter: "all",
              entityStatus: StatusesType.IDLE,
            });
          },
        },
      ),
      updateTodolistTitle: createAppThunk<
        UpdateTodolistThunk,
        UpdateTodolistThunk
      >(
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
              dispatch(
                appActions.setAppStatus({ status: StatusesType.SUCCEEDED }),
              );
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
        {
          fulfilled: (state, action) => {
            const index = state.findIndex(
              (tl) => tl.id === action.payload.todolistID,
            );

            if (index !== -1) state[index].title = action.payload.title;
          },
        },
      ),
    };
  },

  extraReducers: (builder) => {
    builder.addCase(clearTasksAndTodolists, () => {
      return [];
    });
  },
});

export const todolistsSlice = slice.reducer;
export const todolistsActions = slice.actions;
