import React, { FC, memo } from "react";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";
import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Task } from "./task/Task";
import { useTodolist } from "./hooks/useTodolist";
import { TodolistDomainType } from "../todolists-reducer";
import { StatusesType } from "../../../app/app-reducer";

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

    return (
      <div>
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
        <div>
          <Button
            variant={todolist.filter == "all" ? "contained" : "text"}
            disabled={todolist.entityStatus === StatusesType.LOADING}
            onClick={() => onTsarClickHandler("all")}
          >
            All
          </Button>
          <Button
            color={"secondary"}
            variant={todolist.filter == "active" ? "contained" : "text"}
            disabled={todolist.entityStatus === StatusesType.LOADING}
            onClick={() => onTsarClickHandler("active")}
          >
            Active
          </Button>
          <Button
            color={"primary"}
            variant={todolist.filter == "completed" ? "contained" : "text"}
            disabled={todolist.entityStatus === StatusesType.LOADING}
            onClick={() => onTsarClickHandler("completed")}
          >
            Completed
          </Button>
        </div>
      </div>
    );
  },
);
