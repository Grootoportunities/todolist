import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { FilterValuesType } from "./App";
import styled from "styled-components";

export type InsidesPropsType = {
  id: string;
  name: string;
  checked: boolean;
};

type TodolistPropsType = {
  hat: string;
  insides: InsidesPropsType[];
  deleteMovies: (id: string) => void;
  changeFilter: (value: FilterValuesType) => void;
  addMovie: (movieName: string) => void;
  changeMoviesStatus: (movieID: string, checked: boolean) => void;
  filter: FilterValuesType;
};

export function Todolist(props: TodolistPropsType) {
  const [newMovieName, setNewMovieName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mappedInsides = props.insides.map((item) => {
    const onDeleteHandler = () => {
      props.deleteMovies(item.id);
    };

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      props.changeMoviesStatus(item.id, e.currentTarget.checked);
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
      props.addMovie(newMovieName);
      setNewMovieName("");
    }
  };
  const addMovie = () => {
    if (newMovieName.trim() !== "") {
      props.addMovie(newMovieName.trim());
      setNewMovieName("");
    } else setError("Field is required");
  };
  const onAllClickHandler = () => props.changeFilter("all");
  const onActiveClickHandler = () => props.changeFilter("active");
  const onCompletedClickHandler = () => props.changeFilter("completed");

  return (
    <div>
      <h3>{props.hat}</h3>
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
          onClick={onAllClickHandler}
        >
          All
        </button>
        <button
          className={props.filter == "active" ? "active-filter" : ""}
          onClick={onActiveClickHandler}
        >
          Active
        </button>
        <button
          className={props.filter == "completed" ? "active-filter" : ""}
          onClick={onCompletedClickHandler}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
