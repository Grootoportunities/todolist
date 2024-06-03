import React, { FC, memo } from "react";
import { AddItemForm, EditableSpan } from "../../../../../common/components";
import { Button, IconButton, Paper } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Task } from "./task";
import { useTodolist } from "../lib/useTodolist";
import { StatusesType } from "../../../../../common/enums";
import { S } from "./_styles";
import { TodolistDomainType } from "../model/types";

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
      filteredTasks,
    } = useTodolist(demo, todolist);

    const mappedTasks = filteredTasks.map((item) => {
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
          width: "260px",
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
        {tasks.length !== 0 ? (
          <>
            <S.TasksList>{mappedTasks}</S.TasksList>
            <div>{mappedFilterButtons}</div>{" "}
          </>
        ) : (
          <S.NoTasks>No Tasks</S.NoTasks>
        )}
      </Paper>
    );
  },
);
