import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useAppDispatch } from "../../hooks";
import { useAppSelector } from "../../hooks";
import { appActions } from "../../../app/model";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

export function ErrorSnackbar() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.app.error);
  const isOpen = !!error;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(appActions.setAppError({ error: null }));
  };
  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error} 😠
      </Alert>
    </Snackbar>
  );
}
