import React, { FC, memo } from "react";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";
import { Button, IconButton } from "@material-ui/core";
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
      <TodoContainer>
        <h3>
          <EditableSpan
            originTitle={todolist.title}
            onChange={changeTodolistTitleHandler}
            disabled={todolist.entityStatus === StatusesType.LOADING}
          />
          <IconButton
            onClick={removeTodolistHandler}
            disabled={todolist.entityStatus === StatusesType.LOADING}
          >
            <Delete />
          </IconButton>
        </h3>
        <AddItemForm
          addItem={addTask}
          disabled={todolist.entityStatus === StatusesType.LOADING}
        />
        <ul>{mappedTasks}</ul>
        <div>{mappedFilterButtons}</div>
      </TodoContainer>
    );
  },
);

const TodoContainer = styled.div`
  width: 250px;
  word-wrap: break-word;
`;
