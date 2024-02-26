import React, { FC, memo } from "react";
import { FilterValuesType } from "../../AppWithRedux/AppWithRedux";
import { AddItemForm } from "../AddItemForm/AddItemForm";
import { EditableSpan } from "../EditableSpan/EditableSpan";
import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Task } from "../Task/Task";
import { useTodolist } from "./hooks/useTodolist";

export type TaskType = {
  id: string;
  name: string;
  checked: boolean;
};

type TodolistPropsType = {
  todolistId: string;
  hat: string;
  filter: FilterValuesType;

  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  removeTodolist: (todolistId: string) => void;
  changeTodolistTitle: (newTitle: string, todolistId: string) => void;
};

export const Todolist: FC<TodolistPropsType> = memo(
  ({
    todolistId,
    hat,
    filter,
    changeFilter,
    removeTodolist,
    changeTodolistTitle,
  }) => {
    const {
      tasks,
      onTsarClickHandler,
      removeTodolistHandler,
      addTask,
      changeTodolistTitleHandler,
    } = useTodolist(
      todolistId,
      filter,
      changeFilter,
      removeTodolist,
      changeTodolistTitle,
    );

    const mappedTasks = tasks.map((item) => {
      return <Task key={item.id} task={item} todolistId={todolistId} />;
    });

    return (
      <div>
        <h3>
          <EditableSpan
            originTitle={hat}
            onChange={changeTodolistTitleHandler}
          />
          <IconButton onClick={removeTodolistHandler}>
            <Delete />
          </IconButton>
        </h3>
        <AddItemForm addItem={addTask} />
        <ul>{mappedTasks}</ul>
        <div>
          <Button
            variant={filter == "all" ? "contained" : "text"}
            onClick={() => onTsarClickHandler("all")}
          >
            All
          </Button>
          <Button
            color={"secondary"}
            variant={filter == "active" ? "contained" : "text"}
            onClick={() => onTsarClickHandler("active")}
          >
            Active
          </Button>
          <Button
            color={"primary"}
            variant={filter == "completed" ? "contained" : "text"}
            onClick={() => onTsarClickHandler("completed")}
          >
            Completed
          </Button>
        </div>
      </div>
    );
  },
);
