import { authAPI, LoginParamsType } from "../../api/authAPI";
import { setAppStatus, StatusesType } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { clearTasksAndTodolists } from "../../common/actions/common.actions";

const initialState = { isLoggedIn: false };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authReducer = slice.reducer;
export const { setLogin } = slice.actions;

// THUNKS

export const setLoginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: StatusesType.LOADING }));
  authAPI
    .setLogin(data)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setLogin({ isLoggedIn: true }));
        dispatch(clearTasksAndTodolists());
        dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

        return;
      }

      handleServerAppError<{ userId?: number }>(dispatch, res.data);
    })
    .catch((err) => handleServerNetworkError(dispatch, err.message));
};

export const deleteLoginTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: StatusesType.LOADING }));
  authAPI
    .deleteLogin()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setLogin({ isLoggedIn: false }));

        dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

        return;
      }

      handleServerAppError(dispatch, res.data);
    })
    .catch((err) => handleServerNetworkError(dispatch, err.message));
};
