import React, { FC } from "react";
import { useTodolistsList } from "./hooks/useTodolistsList";
import { Grid, Paper } from "@material-ui/core";
import { Todolist } from "./todolist/Todolist";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";

export const TodolistsList: FC = () => {
  const {
    todolists,
    changeFilter,
    removeTodolist,
    onChangeTodolistTitle,
    addTodolist,
  } = useTodolistsList();

  const mappedTodolists = todolists.map((tl) => {
    return (
      <Grid item key={tl.id}>
        <Paper style={{ padding: "20px" }} elevation={3}>
          <Todolist
            todolistId={tl.id}
            hat={tl.title}
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
