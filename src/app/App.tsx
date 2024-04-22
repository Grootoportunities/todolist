import React from "react";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/icons/Menu";
import { TodolistsList } from "../features/todolistsList/TodolistsList";
import { ErrorSnackbar } from "../components/ErrorSnackBar/ErrorSnackbar";
import { StatusesType } from "./app-reducer";
import { useAppSelector } from "./hooks";

type AppProps = { demo?: boolean };

function App({ demo = false }: AppProps) {
  const status = useAppSelector((state) => state.app.status);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">Todolists</Typography>
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
