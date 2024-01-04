import React, { ChangeEvent } from "react";
import { FilterValuesType } from "../App";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";

export type InsidesPropsType = {
  id: string;
  name: string;
  checked: boolean;
};

type TodolistPropsType = {
  todolistId: string;
  hat: string;
  insides: InsidesPropsType[];
  deleteMovies: (id: string, todolistId: string) => void;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (movieName: string, todolistId: string) => void;
  changeMoviesStatus: (
    movieID: string,
    checked: boolean,
    todolistId: string,
  ) => void;
  filter: FilterValuesType;
  removeTodolist: (todolistId: string) => void;
  changeTodolistTitle: (newTitle: string, todolistId: string) => void;
  changeTitleHandler: (
    id: string,
    newTitle: string,
    todolistId: string,
  ) => void;
};

export function Todolist(props: TodolistPropsType) {
  const mappedInsides = props.insides.map((item) => {
    const onDeleteHandler = () => {
      props.deleteMovies(item.id, props.todolistId);
    };

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      props.changeMoviesStatus(
        item.id,
        e.currentTarget.checked,
        props.todolistId,
      );
    };

    const onChangeTitleHandler = (newTitle: string) =>
      props.changeTitleHandler(item.id, newTitle, props.todolistId);

    return (
      <li className={item.checked ? "is-done" : ""} key={item.id}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={onChangeInputHandler}
        />
        <EditableSpan title={item.name} onChange={onChangeTitleHandler} />
        <button onClick={onDeleteHandler}>X</button>
      </li>
    );
  });

  const onTsarClickHandler = (filter: FilterValuesType) => {
    props.changeFilter(filter, props.todolistId);
  };

  const removeTodolistHandler = () => {
    props.removeTodolist(props.todolistId);
  };

  const addTask = (title: string) => {
    props.addTask(title, props.todolistId);
  };

  const onChangeTodolistTitle = (newTitle: string) =>
    props.changeTodolistTitle(newTitle, props.todolistId);

  return (
    <div>
      <h3>
        <EditableSpan title={props.hat} onChange={onChangeTodolistTitle} />
        <button onClick={removeTodolistHandler}>X</button>
      </h3>
      <AddItemForm addItem={addTask} />
      <ul>{mappedInsides}</ul>
      <div>
        <button
          className={props.filter == "all" ? "active-filter" : ""}
          onClick={() => onTsarClickHandler("all")}
        >
          All
        </button>
        <button
          className={props.filter == "active" ? "active-filter" : ""}
          onClick={() => onTsarClickHandler("active")}
        >
          Active
        </button>
        <button
          className={props.filter == "completed" ? "active-filter" : ""}
          onClick={() => onTsarClickHandler("completed")}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
