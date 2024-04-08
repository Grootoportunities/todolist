import { TasksStateType } from "../AppWithRedux/AppWithRedux";
import { v1 } from "uuid";
import {
  AddTodolistAT,
  RemoveTodolistAT,
  SetTodolistsAT,
} from "./todolists-reducer";
import { TaskPriorities, TaskStatuses, TaskType } from "../api/tasksAPI";

export type ActionsType =
  | SetTodolistsAT
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
  type: "CHANGE-TASK-STATUS";
  todolistID: string;
  taskID: string;
  status: TaskStatuses;
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
      const newTask: TaskType = {
        todoListId: action.todolistID,
        id: v1(),
        title: action.title,
        status: TaskStatuses.New,
        startDate: "",
        addedDate: "",
        deadline: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "New Task",
      };
      return {
        ...state,
        [action.todolistID]: [...state[action.todolistID], newTask],
      };
    }
    case "CHANGE-TASK-STATUS":
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map((t) =>
          t.id === action.taskID ? { ...t, status: action.status } : t,
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
    case "SET-TODOLISTS": {
      const stateCopy = { ...state };

      action.todolists.forEach((tl) => (stateCopy[tl.id] = []));

      return stateCopy;

      // return action.todolists.reduce((acc, curr) => {
      //   return { ...acc, [curr.id]: [] };
      // }, {});
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
  status: TaskStatuses,
): ChangeTaskIsDoneAT => ({
  type: "CHANGE-TASK-STATUS",
  todolistID,
  taskID,
  status,
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
