import { authAPI, FieldsErrorsType, LoginParamsType } from "../../api/authAPI";
import { setAppInit, setAppStatus, StatusesType } from "../../app/app-reducer";
import { handleServerAppError } from "../../utils/error-utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "../../common/actions/common.actions";
import { handleServerNetworkError } from "../../common/utils/handleServerNetworkError";
import { AppDispatchType } from "../../app/store";

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(setLoginTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(deleteLoginTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(initAppTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      }),
});

// THUNKS

export const initAppTC = createAsyncThunk<
  boolean,
  undefined,
  { rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null }
>("app/initAppTC", async (_, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;

  try {
    const res = await authAPI.init();
    if (res.data.resultCode === 0) {
      return true;
    } else if (res.data.messages[0] === "You are not authorized") {
      dispatch(setAppStatus({ status: StatusesType.FAILED }));

      return rejectWithValue(null);
    }

    handleServerAppError(dispatch, res.data);
    return rejectWithValue({
      errors: res.data.messages,
      fieldsErrors: res.data.fieldsErrors,
    });
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(setAppInit({ isInit: true }));
  }
});

export const setLoginTC = createAsyncThunk<
  boolean,
  LoginParamsType,
  { rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null }
>(`auth/setLoginTC`, async (data, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await authAPI.setLogin(data);
    debugger;
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

      return true;
    }

    handleServerAppError<{ userId?: number }>(dispatch, res.data);
    return rejectWithValue({
      errors: res.data.messages,
      fieldsErrors: res.data.fieldsErrors,
    });
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const deleteLoginTC = createAsyncThunk<
  boolean,
  undefined,
  { rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null }
>("auth/deleteLoginTC", async (_, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await authAPI.deleteLogin();
    if (res.data.resultCode === 0) {
      dispatch(clearTasksAndTodolists());
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

      return false;
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

export const authReducer = slice.reducer;
