import React, { useState } from "react";
import "./App.css";
import { InsidesPropsType, Todolist } from "./Todolist";
import { v1 } from "uuid";

export type FilterValuesType = "all" | "active" | "completed";

function App() {
  let [movies, setMovies] = useState<InsidesPropsType[]>([
    { id: v1(), name: "Banshee Inisherin", checked: true },
    { id: v1(), name: "Kid of the human", checked: true },
    { id: v1(), name: "Memento", checked: true },
    { id: v1(), name: "Whale", checked: true },
    { id: v1(), name: "Twelve friends of Oushn", checked: false },
    { id: v1(), name: "Seventh mile", checked: false },
  ]);
  let [filter, setFilter] = useState<FilterValuesType>("all");

  function deleteMovies(id: string) {
    let filteredMovies = movies.filter((item) => item.id !== id);
    setMovies(filteredMovies);
  }

  function addMovie(movieName: string) {
    let newMovie = { id: v1(), name: movieName, checked: false };
    let newMovies = [newMovie, ...movies];
    setMovies(newMovies);
  }

  function changeFilter(value: FilterValuesType) {
    setFilter(value);
  }

  function checkChange(movieID: string, checked: boolean) {
    let changeWatched = movies.find((m) => m.id === movieID);
    if (changeWatched) changeWatched.checked = checked;
    setMovies([...movies]);
  }

  let moviesForTodolist = movies;

  if (filter === "completed") {
    moviesForTodolist = movies.filter((item) => item.checked);
  } else if (filter === "active") {
    moviesForTodolist = movies.filter((item) => !item.checked);
  }

  return (
    <div className="App">
      <Todolist
        hat="Movies"
        insides={moviesForTodolist}
        deleteMovies={deleteMovies}
        changeFilter={changeFilter}
        addMovie={addMovie}
        changeMoviesStatus={checkChange}
        filter={filter}
      />
    </div>
  );
}

export default App;
