import axios from "axios";
import {appActions} from "../../app/model/appSlice";
import {AppDispatch} from "../../app/store";
import { StatusesType } from "../enums";

export const handleServerNetworkError = (
  err: unknown,
  dispatch: AppDispatch,
  shouldSetAppError = true,
): void => {
  if (shouldSetAppError) {
    let errorMessage = "Some error occurred";

    if (axios.isAxiosError(err))
      errorMessage =
        err.response?.data?.message || err?.message || errorMessage;
    else if (err instanceof Error)
      errorMessage = `Native error: ${err.message}`;
    else errorMessage = JSON.stringify(err);

    dispatch(appActions.setAppError({ error: errorMessage }));
  }
  dispatch(appActions.setAppStatus({ status: StatusesType.FAILED }));
};
