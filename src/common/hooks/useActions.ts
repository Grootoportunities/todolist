import { useAppDispatch } from "./useAppDispatch";
import { useMemo } from "react";
import { bindActionCreators } from "redux";

import { authThunks } from "../../features/auth";
import { appActions } from "../../app";
import {
  tasksActions,
  tasksThunks,
} from "../../features/todolistsList/ui/todolist/ui/task";
import {
  todolistsActions,
  todolistsThunks,
} from "../../features/todolistsList/ui/todolist";

const allActions = {
  ...tasksThunks,
  ...tasksActions,
  ...todolistsThunks,
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
