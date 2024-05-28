import { useAppSelector } from "../../../app/hooks/hooks";
import { useFormik } from "formik";
import { useEffect } from "react";
import { appSelectors } from "../../../app";
import { selectIsLoggedIn } from "../auth.selectors";
import { useActions } from "../../../app/hooks/useActions";
import { authThunks } from "../auth-reducer";

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
