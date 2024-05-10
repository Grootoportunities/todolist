import { useAppDispatch, useAppSelector } from "./hooks";
import { useCallback, useEffect } from "react";
import { initAppTC } from "../app-reducer";
import { deleteLoginTC } from "../../features/login/auth-reducer";

export const useApp = () => {
  const status = useAppSelector((state) => state.app.status);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const isInit = useAppSelector((state) => state.app.isInit);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initAppTC());
  }, []);

  const onLogoutHandler = useCallback(
    () => dispatch(deleteLoginTC()),
    [dispatch],
  );

  return { status, isLoggedIn, isInit, onLogoutHandler };
};
