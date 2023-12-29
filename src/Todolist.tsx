import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { FilterValuesType } from "./App";

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
  addMovie: (movieName: string, todolistId: string) => void;
  changeMoviesStatus: (
    movieID: string,
    checked: boolean,
    todolistId: string,
  ) => void;
  filter: FilterValuesType;
  removeTodolist: (todolistId: string) => void;
};

export function Todolist(props: TodolistPropsType) {
  const [newMovieName, setNewMovieName] = useState("");
  const [error, setError] = useState<string | null>(null);

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

    return (
      <li className={item.checked ? "is-done" : ""} key={item.id}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={onChangeInputHandler}
        />
        <span>{item.name}</span>
        <button onClick={onDeleteHandler}>X</button>
      </li>
    );
  });
  const onChangeNewMovieNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMovieName(e.currentTarget.value);
  };
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.charCode === 13) {
      props.addMovie(newMovieName, props.todolistId);
      setNewMovieName("");
    }
  };
  const addMovie = () => {
    if (newMovieName.trim() !== "") {
      props.addMovie(newMovieName.trim(), props.todolistId);
      setNewMovieName("");
    } else setError("Field is required");
  };
  // const onAllClickHandler = () => props.changeFilter("all");
  // const onActiveClickHandler = () => props.changeFilter("active");
  // const onCompletedClickHandler = () => props.changeFilter("completed");
  const onTsarClickHandler = (filter: FilterValuesType) => {
    props.changeFilter(filter, props.todolistId);
  };

  const removeTodolistHandler = () => {
    props.removeTodolist(props.todolistId);
  };

  return (
    <div>
      <h3>
        {props.hat} <button onClick={removeTodolistHandler}>X</button>
      </h3>
      <div>
        <input
          value={newMovieName}
          onChange={onChangeNewMovieNameHandler}
          onKeyPress={onKeyPressHandler}
          className={error ? "error" : ""}
        />
        <button onClick={addMovie}>+</button>
        <div className="error-message">{error}</div>
      </div>
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
