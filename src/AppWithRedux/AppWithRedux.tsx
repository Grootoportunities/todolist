import React from "react";
import "../App.css";
import { TaskType, Todolist } from "../components/Todolist/Todolist";
import { AddItemForm } from "../components/AddItemForm/AddItemForm";
import {
  AppBar,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { useAppWithRedux } from "./hooks/useAppWithRedux";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
  id: string;
  hat: string;
  filter: FilterValuesType;
};

export type TasksStateType = { [key: string]: TaskType[] };

function AppWithRedux() {
  const {
    todolists,
    changeFilter,
    removeTodolist,
    onChangeTodolistTitle,
    addTodolist,
  } = useAppWithRedux();

  const mappedTodolists = todolists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <Paper style={{ padding: "20px" }} elevation={3}>
          <Todolist
            todolistId={tl.id}
            hat={tl.hat}
            changeFilter={changeFilter}
            filter={tl.filter}
            removeTodolist={removeTodolist}
            changeTodolistTitle={onChangeTodolistTitle}
          />
        </Paper>
      </Grid>
    );
  });

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
        <Grid style={{ margin: "30px 0" }} container>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={5}>
          {mappedTodolists}
        </Grid>
      </Container>
    </div>
  );
}

export default AppWithRedux;
