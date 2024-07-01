import React, { ChangeEvent, useEffect, useState } from "react";
import { tasksAPI, todolistsAPI } from "features/todolistsList/api";

export default {
  title: "API",
};

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    todolistsAPI.getTodolists().then((res) => setState(res.data));
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [title, setTitle] = useState<string>("");

  const onClickHandler = () =>
    todolistsAPI.createTodolist(title).then((res) => setState(res.data));

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.currentTarget.value);

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={title}
          onChange={onChangeHandler}
          placeholder={"Todolist title"}
        />
        <button onClick={onClickHandler}>Create Todolist</button>
      </div>
    </div>
  );
};

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  const [ID, setID] = useState<string>("");

  const onClickHandler = () =>
    todolistsAPI
      .deleteTodolist(ID)
      .then((res) => setState(res.data))
      .catch((err) => setState(err));

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setID(e.currentTarget.value);

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={ID}
          onChange={onChangeHandler}
          placeholder={"Todolist ID"}
        />
        <button onClick={onClickHandler}>Delete Todolist</button>
      </div>
    </div>
  );
};

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  const [todolistID, setTodolistID] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const onIDChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTodolistID(e.currentTarget.value);

  const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.currentTarget.value);

  const onClickHandler = () =>
    todolistsAPI
      .updateTodolist({ todolistID, title })
      .then((res) => setState(res.data));

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistID}
          placeholder={"Todolist ID"}
          onChange={onIDChangeHandler}
        />
        <input
          value={title}
          placeholder={"New Todolist Title"}
          onChange={onTitleChangeHandler}
        />
        <button onClick={onClickHandler}>Update Todolist Title</button>
      </div>
    </div>
  );
};

export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  const [todolistID, setTodolistID] = useState<string>("");

  useEffect(() => {
    todolistsAPI
      .getTodolists()
      .then((res) => setState(res.data.map((t) => t.id)));
  }, []);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTodolistID(e.currentTarget.value);

  const onClickHandler = () =>
    tasksAPI.getTasks(todolistID).then((res) => setState(res.data));

  return (
    <div>
      <div>Todos ID:</div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistID}
          placeholder={"Todolist ID"}
          onChange={onChangeHandler}
        />
        <button onClick={onClickHandler}>Get Tasks</button>
      </div>
    </div>
  );
};

export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  const [todolistID, setTodolistID] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const onTodoIDChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTodolistID(e.currentTarget.value);

  const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.currentTarget.value);

  const onClickHandler = () =>
    tasksAPI
      .createTask({ todolistID, title })
      .then((res) => setState(res.data));

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistID}
          placeholder={"Todolist ID"}
          onChange={onTodoIDChangeHandler}
        />
        <input
          value={title}
          placeholder={"Title"}
          onChange={onTitleChangeHandler}
        />
        <button onClick={onClickHandler}>Create New Task</button>
      </div>
    </div>
  );
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  const [todolistID, setTodolistID] = useState<string>("");
  const [taskID, setTaskID] = useState<string>("");

  const onTodoIDChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTodolistID(e.currentTarget.value);

  const onTaskIDChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTaskID(e.currentTarget.value);

  const onClickHandler = () =>
    tasksAPI
      .deleteTask({ todolistID, taskID })
      .then((res) => setState(res.data))
      .catch((err) => setState(err));

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistID}
          placeholder={"Todolist ID"}
          onChange={onTodoIDChangeHandler}
        />
        <input
          value={taskID}
          placeholder={"Task ID"}
          onChange={onTaskIDChangeHandler}
        />
        <button onClick={onClickHandler}>Delete Task</button>
      </div>
    </div>
  );
};

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null);
  const [todolistID, setTodolistID] = useState<string>("");
  const [taskID, setTaskID] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const onTodoIDChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTodolistID(e.currentTarget.value);
  const onTaskIDChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTaskID(e.currentTarget.value);
  const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.currentTarget.value);

  const onClickHandler = () =>
    tasksAPI
      .updateTask(todolistID, taskID, {
        title,
        description: "This is updated task",
        status: 0,
        priority: -5,
        startDate: "",
        deadline: "",
      })
      .then((res) => setState(res.data));

  return (
    <div>
      {JSON.stringify(state)}
      <div>
        <input
          value={todolistID}
          placeholder={"Todolist ID"}
          onChange={onTodoIDChangeHandler}
        />
        <input
          value={taskID}
          placeholder={"Task ID"}
          onChange={onTaskIDChangeHandler}
        />
        <input
          value={title}
          placeholder={"New Title"}
          onChange={onTitleChangeHandler}
        />
        <button onClick={onClickHandler}>Update Task Title</button>
      </div>
    </div>
  );
};
