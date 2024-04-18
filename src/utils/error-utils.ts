import {
  AppActionsType,
  setAppErorrAC,
  setAppStatusAC,
  StatusesType,
} from "../app/app-reducer";
import { Dispatch } from "redux";
import { CUDResponseType } from "../api/tasksAPI";

export const handleServerAppError = <D>(
  dispatch: Dispatch<AppActionsType>,
  data: CUDResponseType<D>,
) => {
  dispatch(setAppStatusAC(StatusesType.FAILED));

  if (data.messages.length) {
    dispatch(setAppErorrAC(data.messages[0]));

    return;
  }

  dispatch(setAppErorrAC("Some error occurred"));
};

export const handleServerNetworkError = (
  dispatch: Dispatch<AppActionsType>,
  error: string,
) => {
  dispatch(setAppStatusAC(StatusesType.FAILED));
  dispatch(setAppErorrAC(error));
};
