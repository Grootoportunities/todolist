import {
  createAppAsyncThunk,
  handleServerAppError,
  handleServerNetworkError,
} from "common/utils";
import { createSlice } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions";
import { authAPI, LoginParamsType } from "../api";
import { ResultCode, StatusesType } from "common/enums";
import { appActions } from "app/model";

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(setLogin.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(deleteLogin.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(initApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      }),
});

// THUNKS

const initApp = createAppAsyncThunk<boolean, undefined>(
  "auth/initApp",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await authAPI.init();

      if (res.data.resultCode === ResultCode.Success) return true;
      else if (res.data.messages[0] === "You are not authorized") {
        dispatch(appActions.setAppStatus({ status: StatusesType.FAILED }));

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
      dispatch(appActions.setAppInit({ isInit: true }));
    }
  },
);

const setLogin = createAppAsyncThunk<boolean, LoginParamsType>(
  `auth/setLogin`,
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

    try {
      const res = await authAPI.setLogin(data);

      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

        return true;
      }

      const isShouldSetAppError = !res.data.fieldsErrors.length;

      handleServerAppError<{ userId?: number }>(
        dispatch,
        res.data,
        isShouldSetAppError,
      );

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

const deleteLogin = createAppAsyncThunk<boolean, undefined>(
  "auth/deleteLogin",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

    try {
      const res = await authAPI.deleteLogin();
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(clearTasksAndTodolists());
        dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

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
  },
);

export const authSlice = slice.reducer;
export const authThunks = { deleteLogin, setLogin, initApp };
