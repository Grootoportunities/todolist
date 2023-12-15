import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { FilterValuesType } from "./App";

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
};

export function Todolist(props: TodolistPropsType) {
  const [newMovieName, setNewMovieName] = useState("");

  const mappedInsides = props.insides.map((item) => {
    const onDeleteHandler = () => {
      props.deleteMovies(item.id);
    };

    return (
      <li key={item.id}>
        <input type="checkbox" checked={item.checked} />
        <span>{item.name}</span>
        <button onClick={onDeleteHandler}>X</button>
      </li>
    );
  });
  const onChangeNewMovieNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMovieName(e.currentTarget.value);
  };
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13) {
      props.addMovie(newMovieName);
      setNewMovieName("");
    }
  };
  const addMovie = () => {
    props.addMovie(newMovieName);
    setNewMovieName("");
  };
  const onAllClickHander = () => props.changeFilter("all");
  const onActiveClickHander = () => props.changeFilter("active");
  const onCompletedClickHander = () => props.changeFilter("completed");

  return (
    <div>
      <h3>{props.hat}</h3>
      <div>
        <input
          value={newMovieName}
          onChange={onChangeNewMovieNameHandler}
          onKeyPress={onKeyPressHandler}
        />
        <button onClick={addMovie}>+</button>
      </div>
      <ul>{mappedInsides}</ul>
      <div>
        <button onClick={onAllClickHander}>All</button>
        <button onClick={onActiveClickHander}>Active</button>
        <button onClick={onCompletedClickHander}>Completed</button>
      </div>
    </div>
  );
}
