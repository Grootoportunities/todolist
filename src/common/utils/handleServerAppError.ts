import { Dispatch } from "redux";
import {appActions} from "../../app/model/appSlice";
import { ResponseType } from "../types";

import { StatusesType } from "../enums";

export const handleServerAppError = <D>(
  dispatch: Dispatch,
  data: ResponseType<D>,
  shouldSetAppError = true,
) => {
  if (shouldSetAppError)
    dispatch(
      appActions.setAppError({
        error: data.messages.length ? data.messages[0] : "Some error occurred",
      }),
    );

  dispatch(appActions.setAppStatus({ status: StatusesType.FAILED }));
};
