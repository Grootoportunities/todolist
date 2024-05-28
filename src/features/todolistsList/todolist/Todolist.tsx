import React, { FC, memo } from "react";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";
import { Button, IconButton, Paper } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Task } from "./task/Task";
import { useTodolist } from "./hooks/useTodolist";
import { TodolistDomainType } from "../todolists-reducer";
import { StatusesType } from "../../../app/app-reducer";
import styled from "styled-components";

type TodolistPropsType = {
  todolist: TodolistDomainType;
  demo?: boolean;
};

export const Todolist: FC<TodolistPropsType> = memo(
  ({ todolist, demo = false }) => {
    const {
      tasks,
      onTsarClickHandler,
      removeTodolistHandler,
      addTask,
      changeTodolistTitleHandler,
      filterButtons,
    } = useTodolist(demo, todolist);

    const mappedTasks = tasks.map((item) => {
      return (
        <Task
          disabled={todolist.entityStatus === StatusesType.LOADING}
          key={item.id}
          task={item}
          todolistId={todolist.id}
        />
      );
    });

    const mappedFilterButtons = filterButtons.map((b) => {
      return (
        <Button
          key={b.ID}
          color={b.color}
          variant={todolist.filter == b.filter ? "contained" : "text"}
          disabled={todolist.entityStatus === StatusesType.LOADING}
          onClick={() => onTsarClickHandler(b.filter)}
        >
          {b.text}
        </Button>
      );
    });

    return (
      <Paper
        style={{
          padding: "20px",
          position: "relative",
          width: "250px",
          wordWrap: "break-word",
        }}
        elevation={3}
      >
        <IconButton
          onClick={removeTodolistHandler}
          disabled={todolist.entityStatus === StatusesType.LOADING}
          style={{ position: "absolute", right: "0", top: "0" }}
        >
          <Delete />
        </IconButton>
        <h3>
          <EditableSpan
            originTitle={todolist.title}
            onChange={changeTodolistTitleHandler}
            disabled={todolist.entityStatus === StatusesType.LOADING}
          />
        </h3>
        <AddItemForm
          addItem={addTask}
          disabled={todolist.entityStatus === StatusesType.LOADING}
        />
        <TasksList>{mappedTasks}</TasksList>
        <div>{mappedFilterButtons}</div>
      </Paper>
    );
  },
);

const TasksList = styled.ul`
  list-style: none;
  padding-left: 0;
`;
