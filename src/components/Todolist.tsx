import React, { useCallback } from "react";
import { FilterValuesType } from "../AppWithRedux";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";
import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "../state/store";
import { addTaskAC } from "../state/tasks-reducer";
import { Task } from "./Task";

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

export const Todolist = React.memo((props: TodolistPropsType) => {
  console.log("Todolist is called");

  let tasks = useSelector<RootStateType, TaskType[]>(
    (state) => state.tasks[props.todolistId],
  );

  const dispatch = useDispatch();

  const onTsarClickHandler = useCallback(
    (filter: FilterValuesType) => props.changeFilter(filter, props.todolistId),
    [props.changeFilter, props.todolistId],
  );

  const removeTodolistHandler = () => {
    props.removeTodolist(props.todolistId);
  };

  const addTask = useCallback(
    (title: string) => dispatch(addTaskAC(props.todolistId, title)),
    [dispatch, props.todolistId],
  );

  const onChangeTodolistTitle = useCallback(
    (newTitle: string) => props.changeTodolistTitle(newTitle, props.todolistId),
    [props.changeTodolistTitle, props.todolistId],
  );

  if (props.filter === "completed") {
    tasks = tasks.filter((item) => item.checked);
  } else if (props.filter === "active") {
    tasks = tasks.filter((item) => !item.checked);
  }

  const mappedInsides = tasks.map((item) => {
    return (
      <Task
        todolistId={props.todolistId}
        taskID={item.id}
        checked={item.checked}
        name={item.name}
        key={item.id}
      />
    );
  });

  return (
    <div>
      <h3>
        <EditableSpan title={props.hat} onChange={onChangeTodolistTitle} />
        <IconButton onClick={removeTodolistHandler}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} />
      <ul>{mappedInsides}</ul>
      <div>
        <Button
          variant={props.filter == "all" ? "contained" : "text"}
          onClick={() => onTsarClickHandler("all")}
        >
          All
        </Button>
        <Button
          color={"secondary"}
          variant={props.filter == "active" ? "contained" : "text"}
          onClick={() => onTsarClickHandler("active")}
        >
          Active
        </Button>
        <Button
          color={"primary"}
          variant={props.filter == "completed" ? "contained" : "text"}
          onClick={() => onTsarClickHandler("completed")}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
