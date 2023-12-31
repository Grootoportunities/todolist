import React, { useState } from "react";
import "./App.css";
import { InsidesPropsType, Todolist } from "./components/Todolist";
import { v1 } from "uuid";
import { AddItemForm } from "./components/AddItemForm";

export type FilterValuesType = "all" | "active" | "completed";
type TodolistsType = {
  id: string;
  hat: string;
  filter: FilterValuesType;
};

type TasksStateType = { [key: string]: InsidesPropsType[] };

function App() {
  function deleteMovies(id: string, todolistId: string) {
    let movie = tasksObj[todolistId];
    let filteredMovies = movie.filter((item) => item.id !== id);
    tasksObj[todolistId] = filteredMovies;
    setTasksObj({ ...tasksObj });
  }

  function addMovie(movieName: string, todolistId: string) {
    let movie = { id: v1(), name: movieName, checked: false };
    let movies = tasksObj[todolistId];
    let newMovies = [movie, ...movies];
    tasksObj[todolistId] = newMovies;
    setTasksObj({ ...tasksObj });
  }

  function changeFilter(value: FilterValuesType, todolistId: string) {
    let todolist = todolists.find((tl) => tl.id === todolistId);
    if (todolist) {
      todolist.filter = value;
      setTodolists([...todolists]);
    }
  }

  function checkChange(movieID: string, checked: boolean, todolistId: string) {
    let movies = tasksObj[todolistId];
    let changeWatched = movies.find((m) => m.id === movieID);
    if (changeWatched) {
      changeWatched.checked = checked;
      setTasksObj({ ...tasksObj });
    }
  }

  const todolistId1 = v1();
  const todolistId2 = v1();

  const [todolists, setTodolists] = useState<TodolistsType[]>([
    { id: todolistId1, hat: "Movies", filter: "all" },
    { id: todolistId2, hat: "Games", filter: "all" },
  ]);

  const [tasksObj, setTasksObj] = useState<TasksStateType>({
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
    delete tasksObj[todolistId];
    setTasksObj({ ...tasksObj });
  };

  const onChangeTodolistTitle = (newTitle: string, todolistId: string) => {
    // const neededTodolist = todolists.find((tl) => tl.id === todolistId);
    // if (neededTodolist) neededTodolist.hat = newTitle;

    setTodolists(
      todolists.map((tl) =>
        tl.id === todolistId ? { ...tl, hat: newTitle } : tl,
      ),
    );
  };

  function addTodolist(title: string) {
    let newTodolist: TodolistsType = { id: v1(), filter: "all", hat: title };
    setTodolists([newTodolist, ...todolists]);
    setTasksObj({ ...tasksObj, [newTodolist.id]: [] });
  }

  const changeTitleHandler = (
    taskID: string,
    newTitle: string,
    todolistId: string,
  ) => {
    setTasksObj({
      ...tasksObj,
      [todolistId]: tasksObj[todolistId].map((el) =>
        el.id === taskID ? { ...el, name: newTitle } : el,
      ),
    });
  };

  console.log(todolists);
  return (
    <div className="App">
      <AddItemForm addItem={addTodolist} />

      {todolists.map((tl) => {
        let moviesForTodolist = tasksObj[tl.id];

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
            changeTitleHandler={changeTitleHandler}
            addTask={addMovie}
            changeMoviesStatus={checkChange}
            filter={tl.filter}
            removeTodolist={removeTodolist}
            changeTodolistTitle={onChangeTodolistTitle}
          />
        );
      })}
    </div>
  );
}

export default App;
