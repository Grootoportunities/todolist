import { useAppDispatch, useAppSelector } from "../../../app/hooks/hooks";
import { useFormik } from "formik";
import { initAppTC, setLoginTC } from "../auth-reducer";
import { useEffect } from "react";

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
    onSubmit: async (values, formikHelpers) => {
      const action = await dispatch(setLoginTC(values));
      if (setLoginTC.rejected.match(action)) {
        if (action.payload?.fieldsErrors.length) {
          const error = action.payload?.fieldsErrors[0];
          formikHelpers.setFieldError(error?.field, error?.error);
        }
      }
    },
  });

  useEffect(() => {
    dispatch(initAppTC());
  }, []);

  return { isLoggedIn, status, isInit, formik };
};
