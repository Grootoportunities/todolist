import { authAPI } from "../api/authAPI";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { setLogin } from "../features/login/auth-reducer";
import { Dispatch } from "redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum StatusesType {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

const initialState = {
  status: StatusesType.IDLE,
  error: null as string | null,
  isInit: false,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: StatusesType }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppInit: (state, action: PayloadAction<{ isInit: boolean }>) => {
      state.isInit = action.payload.isInit;
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppError, setAppInit, setAppStatus } = slice.actions;

//THUNKS

export const initAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .init()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setLogin({ isLoggedIn: true }));

        return;
      } else if (res.data.messages[0] === "You are not authorized") {
        dispatch(setAppStatus({ status: StatusesType.FAILED }));

        return;
      }

      handleServerAppError(dispatch, res.data);
    })
    .catch((err) => handleServerNetworkError(dispatch, err.message))
    .finally(() => dispatch(setAppInit({ isInit: true })));
};
