import React, { useCallback } from "react";
import "./App.css";
import { TaskType, Todolist } from "./components/Todolist";
import { AddItemForm } from "./components/AddItemForm";
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
import {
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
} from "./state/todolists-reducer";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
  id: string;
  hat: string;
  filter: FilterValuesType;
};

export type TasksStateType = { [key: string]: TaskType[] };

function AppWithRedux() {
  console.log("App is called");

  const dispatch = useDispatch();

  const todolists = useSelector<RootStateType, TodolistType[]>(
    (state) => state.todolists,
  );

  //Todolists CRUD

  const changeFilter = useCallback(
    (value: FilterValuesType, todolistId: string) =>
      dispatch(changeTodolistFilterAC(todolistId, value)),
    [dispatch],
  );

  const removeTodolist = useCallback(
    (todolistId: string) => dispatch(removeTodolistAC(todolistId)),
    [dispatch],
  );

  const onChangeTodolistTitle = useCallback(
    (newTitle: string, todolistId: string) =>
      dispatch(changeTodolistTitleAC(todolistId, newTitle)),
    [dispatch],
  );

  const addTodolist = useCallback(
    (title: string) => {
      const action = addTodolistAC(title);
      dispatch(action);
    },
    [dispatch],
  );

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
