import React, { FC, memo, useEffect } from "react";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";
import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Task } from "./task/Task";
import { useTodolist } from "./hooks/useTodolist";
import { FilterValuesType, TodolistDomainType } from "../todolists-reducer";
import { useAppDispatch } from "../../../app/store";
import { fetchTasksTC } from "../tasks-reducer";
import { StatusesType } from "../../../app/app-reducer";

type TodolistPropsType = {
  // todolistId: string;
  // hat: string;
  // filter: FilterValuesType;

  todolist: TodolistDomainType;

  demo?: boolean;

  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  removeTodolist: (todolistId: string) => void;
  changeTodolistTitle: (newTitle: string, todolistId: string) => void;
};

export const Todolist: FC<TodolistPropsType> = memo(
  ({
    // todolistId,
    // hat,
    // filter,
    todolist,
    changeFilter,
    removeTodolist,
    changeTodolistTitle,
    demo = false,
  }) => {
    const dispatch = useAppDispatch();
    const {
      tasks,
      onTsarClickHandler,
      removeTodolistHandler,
      addTask,
      changeTodolistTitleHandler,
    } = useTodolist(
      // todolistId,
      // filter,
      todolist,
      changeFilter,
      removeTodolist,
      changeTodolistTitle,
    );

    const mappedTasks = tasks.map((item) => {
      return <Task key={item.id} task={item} todolistId={todolist.id} />;
    });

    useEffect(() => {
      if (demo) return;

      dispatch(fetchTasksTC(todolist.id));
    }, []);

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
            onClick={() => onTsarClickHandler("all")}
          >
            All
          </Button>
          <Button
            color={"secondary"}
            variant={todolist.filter == "active" ? "contained" : "text"}
            onClick={() => onTsarClickHandler("active")}
          >
            Active
          </Button>
          <Button
            color={"primary"}
            variant={todolist.filter == "completed" ? "contained" : "text"}
            onClick={() => onTsarClickHandler("completed")}
          >
            Completed
          </Button>
        </div>
      </div>
    );
  },
);
