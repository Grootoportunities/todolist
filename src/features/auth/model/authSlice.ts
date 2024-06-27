import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions";
import { authAPI, LoginParamsType } from "../api";
import { ThunkAPIConfigType } from "common/types";
import { StatusesType } from "common/enums";
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

const initApp = createAsyncThunk<boolean, undefined, ThunkAPIConfigType>(
  "auth/initApp",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await authAPI.init();
      if (res.data.resultCode === 0) {
        return true;
      } else if (res.data.messages[0] === "You are not authorized") {
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

const setLogin = createAsyncThunk<boolean, LoginParamsType, ThunkAPIConfigType>(
  `auth/setLogin`,
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

    try {
      const res = await authAPI.setLogin(data);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

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
  },
);

const deleteLogin = createAsyncThunk<boolean, undefined, ThunkAPIConfigType>(
  "auth/deleteLogin",
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

    try {
      const res = await authAPI.deleteLogin();
      if (res.data.resultCode === 0) {
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
