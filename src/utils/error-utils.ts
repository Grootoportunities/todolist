import { appActions, StatusesType } from "../features/application";
import { Dispatch } from "redux";
import { CUDResponseType } from "../api/tasksAPI";

export const handleServerAppError = <D>(
  dispatch: Dispatch,
  data: CUDResponseType<D>,
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
