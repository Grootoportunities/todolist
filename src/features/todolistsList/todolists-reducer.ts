import { todolistsAPI, TodolistType } from "../../api/todolistsAPI";
import { setAppStatus, StatusesType } from "../../app/app-reducer";
import { handleServerAppError } from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "../../common/actions/common.actions";
import { AppDispatchType } from "../../app/store";
import { handleServerNetworkError } from "../../common/utils/handleServerNetworkError";
import { FieldsErrorsType } from "../../api/authAPI";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
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
      .addCase(fetchTodolistsTC.fulfilled, (state, action) =>
        action.payload.map((tl) => ({
          ...tl,
          filter: "all",
          entityStatus: StatusesType.IDLE,
        })),
      )
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload);

        if (index !== -1) state.splice(index, 1);
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload,
          filter: "all",
          entityStatus: StatusesType.IDLE,
        });
      })
      .addCase(updateTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex(
          (tl) => tl.id === action.payload.todolistID,
        );

        if (index !== -1) state[index].title = action.payload.title;
      });
  },
});

export const todolistsReducer = slice.reducer;
export const { setTodolistEntityStatus, changeTodolistFilter } = slice.actions;

//THUNKS

export const fetchTodolistsTC = createAsyncThunk<
  TodolistType[],
  undefined,
  { rejectValue: null }
>("todolists/fetchTodolistsTC", async (_, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await todolistsAPI.getTodolists();
    dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

    return res.data;
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const deleteTodolistTC = createAsyncThunk<
  string,
  string,
  { rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null }
>("todolists/deleteTodolistTC", async (todolistID, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(setAppStatus({ status: StatusesType.LOADING }));
  dispatch(
    setTodolistEntityStatus({ todolistID, status: StatusesType.LOADING }),
  );

  try {
    const res = await todolistsAPI.deleteTodolist(todolistID);

    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

      return todolistID;
    }

    dispatch(
      setTodolistEntityStatus({
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
      setTodolistEntityStatus({
        todolistID,
        status: StatusesType.FAILED,
      }),
    );

    handleServerNetworkError(err, dispatch);

    return rejectWithValue(null);
  }
});

export const createTodolistTC = createAsyncThunk<
  TodolistType,
  string,
  { rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null }
>("todolists/createTodolistTC", async (title, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await todolistsAPI.createTodolist(title);

    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

      return res.data.data.item;
    }

    handleServerAppError(dispatch, res.data);
    return rejectWithValue({
      errors: res.data.messages,
      fieldsErrors: res.data.fieldsErrors,
    });
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const updateTodolistTitleTC = createAsyncThunk<
  UpdateTodolistThunk,
  UpdateTodolistThunk,
  { rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null }
>("todolists/updateTodolistTitleTC", async (arg, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;

  const { todolistID, title } = arg;

  dispatch(setAppStatus({ status: StatusesType.LOADING }));
  dispatch(
    setTodolistEntityStatus({
      todolistID,
      status: StatusesType.LOADING,
    }),
  );

  try {
    const res = await todolistsAPI.updateTodolist(todolistID, title);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));
      dispatch(
        setTodolistEntityStatus({
          todolistID,
          status: StatusesType.SUCCEEDED,
        }),
      );

      return { todolistID, title };
    }

    dispatch(
      setTodolistEntityStatus({
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
      setTodolistEntityStatus({
        todolistID,
        status: StatusesType.FAILED,
      }),
    );
    handleServerNetworkError(err, dispatch);

    return rejectWithValue(null);
  }
});

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
