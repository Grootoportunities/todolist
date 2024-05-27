import { useAppDispatch, useAppSelector } from "./hooks";
import { useCallback, useEffect } from "react";
import { deleteLogin, initApp } from "../../features/auth/auth-reducer";
import { authSelectors } from "../../features/auth";
import { selectIsInit, selectStatus } from "../app.selectors";

export const useApp = () => {
  const status = useAppSelector(selectStatus);
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
  const isInit = useAppSelector(selectIsInit);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initApp());
  }, []);

  const onLogoutHandler = useCallback(
    () => dispatch(deleteLogin()),
    [dispatch],
  );

  return { status, isLoggedIn, isInit, onLogoutHandler };
};
