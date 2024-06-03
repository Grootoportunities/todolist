import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ErrorSnackbar } from "../../../../common/components";
import { Navigate } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLogin } from "../../lib/useLogin";
import { StatusesType } from "../../../../common/enums";

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
              {formik.errors.email ? <div>{formik.errors.email}</div> : null}
              <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password ? (
                <div>{formik.errors.password}</div>
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