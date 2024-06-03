import { useCallback, useEffect } from "react";
import {selectIsLoggedIn} from "../../features/auth/model/auth.selectors";
import { selectIsInit, selectStatus } from "../model/app.selectors";
import { useAppSelector } from "../../common/hooks";
import { useActions } from "../../common/hooks";

export const useApp = () => {
  const status = useAppSelector(selectStatus);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isInit = useAppSelector(selectIsInit);
  const { initApp, deleteLogin } = useActions();

  useEffect(() => {
    initApp();
  }, []);

  const onLogoutHandler = useCallback(() => deleteLogin(), []);

  return { status, isLoggedIn, isInit, onLogoutHandler };
};
