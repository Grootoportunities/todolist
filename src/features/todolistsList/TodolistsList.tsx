import React, { FC } from "react";
import { useTodolistsList } from "./hooks/useTodolistsList";
import { Grid, Paper } from "@material-ui/core";
import { Todolist } from "./todolist/Todolist";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";

export type TodolistsListProps = {
  demo?: boolean;
};

export const TodolistsList: FC<TodolistsListProps> = ({ demo = false }) => {
  const { todolists, addTodolist } = useTodolistsList(demo);

  const mappedTodolists = todolists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <Paper style={{ padding: "20px" }} elevation={3}>
          <Todolist todolist={tl} demo={demo} />
        </Paper>
      </Grid>
    );
  });

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
