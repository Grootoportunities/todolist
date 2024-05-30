import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootStateType } from "../store";
import { useCallback, useEffect, useMemo } from "react";
import { bindActionCreators } from "redux";
import {
  tasksActions,
  tasksThunks,
  todolistsActions,
  todolistsThunks,
} from "../../features/todolistsList";
import { authSelectors, authThunks } from "../../features/auth";
import { appActions } from "../../features/application";
import { selectIsInit, selectStatus } from "../app.selectors";

const allActions = {
  ...tasksThunks,
  ...tasksActions,
  ...todolistsThunks,
  ...todolistsActions,
  ...authThunks,
  ...appActions,
};

export const useAppDispatch = () => useDispatch<AppDispatchType>();
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;
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
export const useApp = () => {
  const status = useAppSelector(selectStatus);
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
  const isInit = useAppSelector(selectIsInit);
  const { initApp, deleteLogin } = useActions();

  useEffect(() => {
    initApp();
  }, []);

  const onLogoutHandler = useCallback(() => deleteLogin(), []);

  return { status, isLoggedIn, isInit, onLogoutHandler };
};

//TYPES
type AllActions = typeof allActions;
type AllActionsBindDispatch = RemapActionCreators<AllActions>;
type RemapActionCreators<T extends Record<string, any>> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<ReturnType<T[K]>>;
};
