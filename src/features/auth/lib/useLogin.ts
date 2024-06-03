import { useFormik } from "formik";
import { useEffect } from "react";
import {selectIsInit, selectStatus} from "../../../app/model/app.selectors";
import { selectIsLoggedIn } from "../model/auth.selectors";
import { authThunks } from "../model/authSlice";
import { useAppSelector } from "../../../common/hooks";
import { useActions } from "../../../common/hooks";

export const useLogin = () => {
  const { initApp, setLogin } = useActions();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const status = useAppSelector(selectStatus);
  const isInit = useAppSelector(selectIsInit);

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
      const action = await setLogin(values);
      if (authThunks.setLogin.rejected.match(action)) {
        if (action.payload?.fieldsErrors.length) {
          const error = action.payload?.fieldsErrors[0];
          formikHelpers.setFieldError(error?.field, error?.error);
        }
      }
    },
  });

  useEffect(() => {
    initApp();
  }, []);

  return { isLoggedIn, status, isInit, formik };
};
