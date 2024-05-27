import { useAppSelector } from "./hooks";
import { useCallback, useEffect } from "react";
import { authSelectors } from "../../features/auth";
import { selectIsInit, selectStatus } from "../app.selectors";
import { useActions } from "./useActions";

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
