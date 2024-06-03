import {useMemo} from "react";
import {bindActionCreators} from "redux";
import {appActions} from "../../app/model/appSlice";
import {authThunks} from "../../features/auth/model/authSlice";
import {todolistsActions, todolistsThunks} from "../../features/todolistsList/ui/todolist/model/todolistsSlice";

import {tasksActions, tasksThunks,} from "../../features/todolistsList/ui/todolist/ui/task";
import {useAppDispatch} from "./useAppDispatch";


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
