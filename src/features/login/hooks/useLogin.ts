import { useAppDispatch, useAppSelector } from "../../../app/hooks/hooks";
import { useFormik } from "formik";
import { setLoginTC } from "../auth-reducer";
import { useEffect } from "react";
import { initAppTC } from "../../../app/app-reducer";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const status = useAppSelector((state) => state.app.status);
  const isInit = useAppSelector((state) => state.app.isInit);

  const formik = useFormik({
    validate: (values) => {
      if (!values.email) return { email: "Email is required" };
      if (!values.password) return { password: "Password is required" };
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values) => dispatch(setLoginTC(values)),
  });

  useEffect(() => dispatch(initAppTC()), []);

  return { isLoggedIn, status, isInit, formik };
};
