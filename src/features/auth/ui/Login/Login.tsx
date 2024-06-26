import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ErrorSnackbar } from "common/components";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { Navigate } from "react-router-dom";
import { useLogin } from "../../lib";
import React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { StatusesType } from "common/enums";

export const Login = () => {
  const { isLoggedIn, status, isInit, formik } = useLogin();

  if (!isInit) {
    return (
      <Grid
        container
        justifyContent={"center"}
        height={"100vh"}
        alignItems={"center"}
      >
        <CircularProgress />
      </Grid>
    );
  }

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid
      container
      justifyContent={"center"}
      height={"100vh"}
      alignItems={"center"}
    >
      <Grid item justifyContent={"center"}>
        {status === StatusesType.LOADING && <LinearProgress />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a
                  href={"https://social-network.samuraijs.com/"}
                  target={"_blank"}
                >
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email ? (
                <div style={{ color: "red" }}>{formik.errors.email}</div>
              ) : null}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password ? (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                label={"Remember me"}
                control={
                  <Checkbox
                    {...formik.getFieldProps("rememberMe")}
                    checked={formik.values.rememberMe}
                  />
                }
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
        <ErrorSnackbar />
      </Grid>
    </Grid>
  );
};
