import { appActions, StatusesType } from "../app/app-reducer";
import { Dispatch } from "redux";
import { CUDResponseType } from "../api/tasksAPI";

export const handleServerAppError = <D>(
  dispatch: Dispatch,
  data: CUDResponseType<D>,
) => {
  dispatch(appActions.setAppStatus({ status: StatusesType.FAILED }));

  if (data.messages.length) {
    dispatch(appActions.setAppError({ error: data.messages[0] }));

    return;
  }

  dispatch(appActions.setAppError({ error: "Some error occurred" }));
};

export const handleServerNetworkError = (dispatch: Dispatch, error: string) => {
  dispatch(appActions.setAppStatus({ status: StatusesType.FAILED }));
  dispatch(appActions.setAppError({ error }));
};
