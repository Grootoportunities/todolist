import { selectIsLoggedIn } from "../model/auth.selectors";
import { useActions } from "common/hooks";
import { FormikHelpers, useFormik } from "formik";
import { useEffect } from "react";
import { appSelectors } from "../../../app/model";
import { useAppSelector } from "common/hooks";
import { authThunks } from "../model";
import { LoginParamsType } from "features/auth/api";

export const useLogin = () => {
  const { initApp, setLogin } = useActions();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const status = useAppSelector(appSelectors.selectStatus);
  const isInit = useAppSelector(appSelectors.selectIsInit);

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
    onSubmit: async (
      values: LoginParamsType,
      formikHelpers: FormikHelpers<LoginParamsType>,
    ) => {
      const action = await setLogin(values);
      if (authThunks.setLogin.rejected.match(action)) {
        if (action.payload?.fieldsErrors.length) {
          const error = action.payload?.fieldsErrors.map((err) => err);
          error.forEach((err) =>
            formikHelpers.setFieldError(err.field, err.error),
          );
        }
      }
    },
  });

  useEffect(() => {
    initApp();
  }, []);

  return { isLoggedIn, status, isInit, formik };
};
