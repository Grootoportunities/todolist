import React, { FC, useEffect } from "react";
import { useTodolistsList } from "./hooks/useTodolistsList";
import { Grid, Paper } from "@material-ui/core";
import { Todolist } from "./todolist/Todolist";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { fetchTodolistsTC } from "./todolists-reducer";
import { useAppDispatch } from "../../app/store";

type TodolistsListProps = {
  demo?: boolean;
};

export const TodolistsList: FC<TodolistsListProps> = ({ demo = false }) => {
  const {
    todolists,
    changeFilter,
    removeTodolist,
    onChangeTodolistTitle,
    addTodolist,
  } = useTodolistsList();

  const dispatch = useAppDispatch();

  const mappedTodolists = todolists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <Paper style={{ padding: "20px" }} elevation={3}>
          <Todolist
            todolist={tl}
            changeFilter={changeFilter}
            removeTodolist={removeTodolist}
            changeTodolistTitle={onChangeTodolistTitle}
            demo={demo}
          />
        </Paper>
      </Grid>
    );
  });

  useEffect(() => {
    if (demo) return;

    dispatch(fetchTodolistsTC());
  }, []);

  return (
    <>
      <Grid style={{ margin: "30px 0" }} container>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={5}>
        {mappedTodolists}
      </Grid>
    </>
  );
};
