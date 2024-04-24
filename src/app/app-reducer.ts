import { AppThunksType } from "./store";
import { authAPI } from "../api/authAPI";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { setLoginAC } from "../features/login/auth-reducer";

export enum StatusesType {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

const initialState: AppStateType = {
  status: StatusesType.IDLE,
  error: null,
  isInit: false,
};

export const appReducer = (
  state: AppStateType = initialState,
  action: AppActionsType,
) => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-INIT":
      return { ...state, isInit: action.isInit };
    default:
      return state;
  }
};

export const setAppStatusAC = (status: StatusesType) =>
  ({
    type: "APP/SET-STATUS",
    status,
  }) as const;

export const setAppErorrAC = (error: string | null) =>
  ({
    type: "APP/SET-ERROR",
    error,
  }) as const;

export const setAppInitAC = (isInit: boolean) =>
  ({ type: "APP/SET-INIT", isInit }) as const;

//THUNKS

export const initAppTC = (): AppThunksType => (dispatch) => {
  authAPI
    .init()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setLoginAC(true));

        return;
      } else if (res.data.messages[0] === "You are not authorized") {
        dispatch(setAppStatusAC(StatusesType.FAILED));

        return;
      }

      handleServerAppError(dispatch, res.data);
    })
    .catch((err) => handleServerNetworkError(dispatch, err.message))
    .finally(() => dispatch(setAppInitAC(true)));
};

//TYPES

export type AppStateType = {
  status: StatusesType;
  error: string | null;
  isInit: boolean;
};

export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorAT = ReturnType<typeof setAppErorrAC>;
export type SetAppInitAT = ReturnType<typeof setAppInitAC>;

export type AppActionsType = SetAppStatusAT | SetAppErrorAT | SetAppInitAT;
