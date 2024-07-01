import { useAppDispatch } from "./useAppDispatch";
import { useMemo } from "react";
import { bindActionCreators } from "redux";
import {
  tasksActions,
  tasksThunks,
  todolistsActions,
} from "features/todolistsList/model";
import { authThunks } from "features/auth/model";
import { appActions } from "app/model";

const allActions = {
  ...tasksThunks,
  ...tasksActions,
  ...todolistsActions,
  ...authThunks,
  ...appActions,
};

export const useActions = () => {
  const dispatch = useAppDispatch();

  return useMemo(
    () =>
      bindActionCreators<AllActions, AllActionsBindDispatch>(
        allActions,
        dispatch,
      ),
    [dispatch],
  );
};

//TYPES
type AllActions = typeof allActions;
type AllActionsBindDispatch = RemapActionCreators<AllActions>;
type RemapActionCreators<T extends Record<string, any>> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<ReturnType<T[K]>>;
};
