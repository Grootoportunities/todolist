import { TasksStateType, TodolistType } from "../AppWithRedux";
import { addTodolistAC, todolistsReducer } from "./todolists-reducer";
import { tasksReducer } from "./tasks-reducer";

test("ID's of tasks and todolists should be equal", () => {
  const startTodolistsState: TodolistType[] = [];
  const startTasksState: TasksStateType = {};

  const action = addTodolistAC("New Todolist Title");

  const endTodolistState = todolistsReducer(startTodolistsState, action);
  const endTasksState = tasksReducer(startTasksState, action);

  const keys = Object.keys(endTasksState);
  const idFromTodolist = endTodolistState[0].id;
  const idFromTasks = keys[0];

  expect(idFromTasks).toBe(action.todolistID);
  expect(idFromTodolist).toBe(action.todolistID);
});
