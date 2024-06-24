import { useFormik } from "formik";
import { useEffect } from "react";
import { authThunks } from "../model";
import { useAppSelector } from "../../../common/hooks";
import { useActions } from "../../../common/hooks";
import { appSelectors } from "../../../app/model";
import { selectIsLoggedIn } from "../model/auth.selectors";

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
