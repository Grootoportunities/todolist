import React, { useState } from "react";
import "./App.css";
import { Todolist } from "./Todolist";
import { v1 } from "uuid";

export type FilterValuesType = "all" | "active" | "completed";
type TodolistsType = {
  id: string;
  hat: string;
  filter: FilterValuesType;
};

function App() {
  function deleteMovies(id: string, todolistId: string) {
    let movie = moviesObj[todolistId];
    let filteredMovies = movie.filter((item) => item.id !== id);
    moviesObj[todolistId] = filteredMovies;
    setMoviesObj({ ...moviesObj });
  }

  function addMovie(movieName: string, todolistId: string) {
    let movie = { id: v1(), name: movieName, checked: false };
    let movies = moviesObj[todolistId];
    let newMovies = [movie, ...movies];
    moviesObj[todolistId] = newMovies;
    setMoviesObj({ ...moviesObj });
  }

  function changeFilter(value: FilterValuesType, todolistId: string) {
    let todolist = todolists.find((tl) => tl.id === todolistId);
    if (todolist) {
      todolist.filter = value;
      setTodolists([...todolists]);
    }
  }

  function checkChange(movieID: string, checked: boolean, todolistId: string) {
    let movies = moviesObj[todolistId];
    let changeWatched = movies.find((m) => m.id === movieID);
    if (changeWatched) {
      changeWatched.checked = checked;
      setMoviesObj({ ...moviesObj });
    }
  }

  const todolistId1 = v1();
  const todolistId2 = v1();

  const [todolists, setTodolists] = useState<TodolistsType[]>([
    { id: todolistId1, hat: "Movies", filter: "active" },
    { id: todolistId2, hat: "Games", filter: "completed" },
  ]);

  const [moviesObj, setMoviesObj] = useState({
    [todolistId1]: [
      { id: v1(), name: "Banshee Inisherin", checked: true },
      { id: v1(), name: "Kid of the human", checked: true },
      { id: v1(), name: "Memento", checked: true },
      { id: v1(), name: "Whale", checked: true },
      { id: v1(), name: "Twelve friends of Oushn", checked: false },
      { id: v1(), name: "Seventh mile", checked: false },
    ],
    [todolistId2]: [
      { id: v1(), name: "Grand Theft Auto: San Andreas", checked: false },
      { id: v1(), name: "Fallout 4", checked: true },
    ],
  });

  const removeTodolist = (todolistId: string) => {
    let filteredTodolist = todolists.filter((tl) => tl.id !== todolistId);
    setTodolists(filteredTodolist);
    delete moviesObj[todolistId];
    setMoviesObj({ ...moviesObj });
  };

  console.log(todolists);
  return (
    <div className="App">
      {todolists.map((tl) => {
        let moviesForTodolist = moviesObj[tl.id];

        if (tl.filter === "completed") {
          moviesForTodolist = moviesForTodolist.filter((item) => item.checked);
        } else if (tl.filter === "active") {
          moviesForTodolist = moviesForTodolist.filter((item) => !item.checked);
        }

        return (
          <Todolist
            key={tl.id}
            todolistId={tl.id}
            hat={tl.hat}
            insides={moviesForTodolist}
            deleteMovies={deleteMovies}
            changeFilter={changeFilter}
            addMovie={addMovie}
            changeMoviesStatus={checkChange}
            filter={tl.filter}
            removeTodolist={removeTodolist}
          />
        );
      })}
    </div>
  );
}

export default App;
