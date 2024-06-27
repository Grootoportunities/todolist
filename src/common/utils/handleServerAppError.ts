import { ResponseType } from "../types";
import { StatusesType } from "../enums";
import { appActions } from "app/model";
import { AppDispatch } from "app/store";

export const handleServerAppError = <D>(
  dispatch: AppDispatch,
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
