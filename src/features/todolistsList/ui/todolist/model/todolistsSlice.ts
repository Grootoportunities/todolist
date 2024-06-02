import { todolistsAPI } from "../api/todolistsAPI";
import { appActions } from "../../../../../app";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "../../../../../common/actions";
import { AppDispatch } from "../../../../../app/store";
import { handleServerNetworkError } from "../../../../../common/utils";
import { StatusesType } from "../../../../../common/enums";
import { ThunkAPIConfigType } from "../../../../../common/types";
import { handleServerAppError } from "../../../../../common/utils";
import { TodolistType } from "../api/types";

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

//TODO Сделать санки, которые используются в tasksReducer - отдельными экшенами с помощью actionCreator?
// UPD: Не получится: это санки, а не редюсеры. Попробовал сделать общие экшены с application редюсера (как делал в
// видосе Димыч) - не помогло.
const fetchTodolists = createAsyncThunk<
  TodolistType[],
  undefined,
  { rejectValue: null }
>(`${slice.name}/fetchTodolists`, async (_, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatch;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await todolistsAPI.getTodolists();
    dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

    return res.data;
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

const deleteTodolist = createAsyncThunk<string, string, ThunkAPIConfigType>(
  `${slice.name}/deleteTodolist`,
  async (todolistID, thunkAPI) => {
    const dispatch = thunkAPI.dispatch as AppDispatch;
    const rejectWithValue = thunkAPI.rejectWithValue;

    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
    dispatch(
      todolistsActions.setTodolistEntityStatus({
        todolistID,
        status: StatusesType.LOADING,
      }),
    );

    try {
      const res = await todolistsAPI.deleteTodolist(todolistID);

      if (res.data.resultCode === 0) {
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

const createTodolist = createAsyncThunk<
  TodolistType,
  string,
  ThunkAPIConfigType
>(`${slice.name}/createTodolist`, async (title, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatch;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await todolistsAPI.createTodolist(title);

    if (res.data.resultCode === 0) {
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
});

const updateTodolistTitle = createAsyncThunk<
  UpdateTodolistThunk,
  UpdateTodolistThunk,
  ThunkAPIConfigType
>(`${slice.name}/updateTodolistTitle`, async (arg, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatch;
  const rejectWithValue = thunkAPI.rejectWithValue;

  const { todolistID, title } = arg;

  dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
  dispatch(
    todolistsActions.setTodolistEntityStatus({
      todolistID,
      status: StatusesType.LOADING,
    }),
  );

  try {
    const res = await todolistsAPI.updateTodolist(todolistID, title);
    if (res.data.resultCode === 0) {
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
});

export const todolistsSlice = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = {
  fetchTodolists,
  deleteTodolist,
  createTodolist,
  updateTodolistTitle,
};

//TYPES

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = {
  filter: FilterValuesType;
  entityStatus: StatusesType;
} & TodolistType;

type UpdateTodolistThunk = {
  todolistID: string;
  title: string;
};
