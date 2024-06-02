import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/icons/Menu";
import { TodolistsList } from "../../features/todolistsList";
import { ErrorSnackbar } from "../../common/components";
import { Navigate } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useApp } from "../lib/useApp";
import { StatusesType } from "../../common/enums";

type AppProps = { demo?: boolean };

function App({ demo = false }: AppProps) {
  const { status, isLoggedIn, isInit, onLogoutHandler } = useApp();

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

  if (!isLoggedIn) return <Navigate to={"/login"} />;

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">Todolists</Typography>
          <Button variant={"contained"} onClick={onLogoutHandler}>
            Logout
          </Button>
        </Toolbar>
        {status === StatusesType.LOADING && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <TodolistsList demo={demo} />
      </Container>
      <ErrorSnackbar />
    </div>
  );
}

export default App;
