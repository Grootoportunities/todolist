import { TasksStateType } from "../AppWithRedux";
import { v1 } from "uuid";
import { AddTodolistAT, RemoveTodolistAT } from "./todolists-reducer";

export type ActionsType =
  | RemoveTaskAT
  | AddTaskAT
  | ChangeTaskIsDoneAT
  | ChangeTaskTitleAT
  | AddTodolistAT
  | RemoveTodolistAT;

export type RemoveTaskAT = {
  type: "REMOVE-TASK";
  todolistID: string;
  taskID: string;
};
export type AddTaskAT = { type: "ADD-TASK"; todolistID: string; title: string };
export type ChangeTaskIsDoneAT = {
  type: "CHANGE-IS-DONE-TASK";
  todolistID: string;
  taskID: string;
  isDone: boolean;
};
export type ChangeTaskTitleAT = {
  type: "CHANGE-TASK-TITLE";
  todolistID: string;
  taskID: string;
  title: string;
};

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionsType,
): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].filter(
          (t) => t.id !== action.taskID,
        ),
      };
    case "ADD-TASK": {
      const newTask = { id: v1(), name: action.title, checked: false };
      return {
        ...state,
        [action.todolistID]: [...state[action.todolistID], newTask],
      };
    }
    case "CHANGE-IS-DONE-TASK":
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map((t) =>
          t.id === action.taskID ? { ...t, checked: action.isDone } : t,
        ),
      };
    case "CHANGE-TASK-TITLE":
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map((t) =>
          t.id === action.taskID ? { ...t, name: action.title } : t,
        ),
      };
    case "ADD-TODOLIST":
      return { ...state, [action.todolistID]: [] };
    case "REMOVE-TODOLIST": {
      const stateCopy = { ...state };
      delete stateCopy[action.id];
      return stateCopy;
    }
    default:
      return state;
  }
};

export const removeTaskAC = (
  todolistID: string,
  taskID: string,
): RemoveTaskAT => ({
  type: "REMOVE-TASK",
  todolistID,
  taskID,
});
export const addTaskAC = (todolistID: string, title: string): AddTaskAT => ({
  type: "ADD-TASK",
  todolistID,
  title,
});
export const changeTaskIsDoneAC = (
  todolistID: string,
  taskID: string,
  isDone: boolean,
): ChangeTaskIsDoneAT => ({
  type: "CHANGE-IS-DONE-TASK",
  todolistID,
  taskID,
  isDone,
});
export const changeTaskTitleAC = (
  todolistID: string,
  taskID: string,
  title: string,
): ChangeTaskTitleAT => ({
  type: "CHANGE-TASK-TITLE",
  todolistID,
  taskID,
  title,
});
