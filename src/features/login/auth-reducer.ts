import { AppThunksType } from "../../app/store";
import { authAPI, LoginParamsType } from "../../api/authAPI";
import { setAppStatusAC, StatusesType } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";

const initialState: AuthInitialStateType = { isLoggedIn: false };

export const authReducer = (
  state: AuthInitialStateType = initialState,
  action: AuthActionsType,
): AuthInitialStateType => {
  switch (action.type) {
    case "LOGIN/SET-LOGIN":
      return { ...state, isLoggedIn: action.isLoggedIn };

    default:
      return state;
  }
};

export const setLoginAC = (isLoggedIn: boolean) =>
  ({
    type: "LOGIN/SET-LOGIN",
    isLoggedIn,
  }) as const;

// THUNKS

export const setLoginTC =
  (data: LoginParamsType): AppThunksType =>
  (dispatch) => {
    dispatch(setAppStatusAC(StatusesType.LOADING));
    authAPI
      .setLogin(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setLoginAC(true));
          dispatch(setAppStatusAC(StatusesType.SUCCEEDED));

          return;
        }

        handleServerAppError<{ userId?: number }>(dispatch, res.data);
      })
      .catch((err) => handleServerNetworkError(dispatch, err.message));
  };

export const deleteLoginTC = (): AppThunksType => (dispatch) => {
  dispatch(setAppStatusAC(StatusesType.LOADING));
  authAPI
    .deleteLogin()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setLoginAC(false));
        dispatch(setAppStatusAC(StatusesType.SUCCEEDED));

        return;
      }

      handleServerAppError(dispatch, res.data);
    })
    .catch((err) => handleServerNetworkError(dispatch, err.message));
};

//TYPES

export type AuthActionsType = ReturnType<typeof setLoginAC>;

type AuthInitialStateType = { isLoggedIn: boolean };
