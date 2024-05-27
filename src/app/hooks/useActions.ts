import { useAppDispatch } from "./hooks";
import { useMemo } from "react";
import { bindActionCreators } from "redux";
import {
  tasksActions,
  tasksThunks,
} from "../../features/todolistsList/tasks-reducer";
import { authThunks } from "../../features/auth/auth-reducer";
import {
  todolistsActions,
  todolistsThunks,
} from "../../features/todolistsList/todolists-reducer";

const allActions = {
  ...tasksThunks,
  ...authThunks,
  ...todolistsThunks,
  ...todolistsActions,
  ...tasksActions,
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
