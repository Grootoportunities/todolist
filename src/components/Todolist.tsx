import React, { ChangeEvent } from "react";
import { FilterValuesType } from "../AppWithRedux";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";
import { Button, Checkbox, IconButton } from "@material-ui/core";
import { CheckBox, Delete } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "../state/store";
import {
  addTaskAC,
  changeTaskIsDoneAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "../state/tasks-reducer";
import { TasksStateType } from "../AppWithRedux";

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

export function Todolist(props: TodolistPropsType) {
  const dispatch = useDispatch();

  let tasks = useSelector<RootStateType, TaskType[]>(
    (state) => state.tasks[props.todolistId],
  );

  if (props.filter === "completed") {
    tasks = tasks.filter((item) => item.checked);
  } else if (props.filter === "active") {
    tasks = tasks.filter((item) => !item.checked);
  }

  const mappedInsides = tasks.map((item) => {
    const onDeleteHandler = () =>
      dispatch(removeTaskAC(props.todolistId, item.id));

    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(
        changeTaskIsDoneAC(props.todolistId, item.id, e.currentTarget.checked),
      );

    const onChangeTitleHandler = (newTitle: string) =>
      dispatch(changeTaskTitleAC(props.todolistId, item.id, newTitle));

    return (
      <li className={item.checked ? "is-done" : ""} key={item.id}>
        <Checkbox checked={item.checked} onChange={onChangeStatusHandler} />
        <EditableSpan title={item.name} onChange={onChangeTitleHandler} />
        <IconButton onClick={onDeleteHandler}>
          <Delete />
        </IconButton>
      </li>
    );
  });

  const onTsarClickHandler = (filter: FilterValuesType) => {
    props.changeFilter(filter, props.todolistId);
  };

  const removeTodolistHandler = () => {
    props.removeTodolist(props.todolistId);
  };

  const addTask = (title: string) =>
    dispatch(addTaskAC(props.todolistId, title));

  const onChangeTodolistTitle = (newTitle: string) =>
    props.changeTodolistTitle(newTitle, props.todolistId);

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
}
