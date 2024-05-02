import { setAppError, setAppStatus, StatusesType } from "../app/app-reducer";
import { Dispatch } from "redux";
import { CUDResponseType } from "../api/tasksAPI";

export const handleServerAppError = <D>(
  dispatch: Dispatch,
  data: CUDResponseType<D>,
) => {
  dispatch(setAppStatus({ status: StatusesType.FAILED }));

  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }));

    return;
  }

  dispatch(setAppError({ error: "Some error occurred" }));
};

export const handleServerNetworkError = (dispatch: Dispatch, error: string) => {
  dispatch(setAppStatus({ status: StatusesType.FAILED }));
  dispatch(setAppError({ error }));
};
