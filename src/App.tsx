import React, { useState } from "react";
import "./App.css";
import { InsidesPropsType, Todolist } from "./Todolist";

export type FilterValuesType = "all" | "active" | "completed";

function App() {
  let [movies, setMovies] = useState<InsidesPropsType[]>([
    { id: 1, name: "Banshee Inisherin", checked: true },
    { id: 2, name: "Kid of the human", checked: true },
    { id: 3, name: "Memento", checked: true },
    { id: 4, name: "Whale", checked: true },
    { id: 5, name: "Twelve friends of Oushn", checked: false },
    { id: 6, name: "Seventh mile", checked: false },
  ]);
  let [filter, setFilter] = useState<FilterValuesType>("all");

  function deleteMovies(id: number) {
    let filteredMovies = movies.filter((item) => item.id !== id);
    setMovies(filteredMovies);
  }

  function changeFilter(value: FilterValuesType) {
    setFilter(value);
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
      />
    </div>
  );
}

export default App;
