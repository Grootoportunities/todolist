import React, { useEffect } from "react";
import "./App.css";
import {
  AppBar,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { fetchTodolistsTC } from "../features/todolistsList/todolists-reducer";
import { useAppDispatch } from "./store";
import { TodolistsList } from "../features/todolistsList/TodolistsList";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodolistsTC());
  }, []);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">Photos</Typography>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <TodolistsList />
      </Container>
    </div>
  );
}

export default App;
