import { TasksStateType } from "../AppWithRedux/AppWithRedux";
import {
  AddTodolistAT,
  RemoveTodolistAT,
  SetTodolistsAT,
} from "./todolists-reducer";
import { tasksAPI, TaskType, UpdateTaskModelType } from "../api/tasksAPI";
import { Dispatch } from "redux";
import { RootStateType } from "./store";

export type ActionsType =
  | ChangeTaskAT
  | SetTasksAT
  | SetTodolistsAT
  | RemoveTaskAT
  | AddTaskAT
  | AddTodolistAT
  | RemoveTodolistAT;

export type RemoveTaskAT = {
  type: "REMOVE-TASK";
  todolistID: string;
  taskID: string;
};
export type AddTaskAT = {
  type: "ADD-TASK";
  task: TaskType;
};
export type ChangeTaskAT = {
  type: "CHANGE-TASK";
  todolistID: string;
  taskID: string;
  model: UpdateTaskModelType;
};
export type SetTasksAT = {
  type: "SET-TASKS";
  tasks: TaskType[];
  todolistID: string;
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
      return {
        ...state,
        [action.task.todoListId]: [
          action.task,
          ...state[action.task.todoListId],
        ],
      };
    }
    case "CHANGE-TASK":
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map((t) =>
          t.id === action.taskID ? { ...t, ...action.model } : t,
        ),
      };
    case "ADD-TODOLIST":
      return { ...state, [action.todolist.id]: [] };
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

    case "SET-TASKS":
      return { ...state, [action.todolistID]: action.tasks };
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
export const addTaskAC = (task: TaskType): AddTaskAT => ({
  type: "ADD-TASK",
  task,
});
export const setTasksAC = (
  todolistID: string,
  tasks: TaskType[],
): SetTasksAT => ({
  type: "SET-TASKS",
  tasks,
  todolistID,
});
export const changeTaskAC = (
  todolistID: string,
  taskID: string,
  model: UpdateTaskModelType,
): ChangeTaskAT => ({
  type: "CHANGE-TASK",
  todolistID,
  taskID,
  model,
});

//THUNKS

export const fetchTasksTC = (todolistID: string) => (dispatch: Dispatch) =>
  tasksAPI
    .getTasks(todolistID)
    .then((res) => dispatch(setTasksAC(todolistID, res.data.items)));

export const deleteTaskTC =
  (todolistID: string, taskID: string) => (dispatch: Dispatch) =>
    tasksAPI
      .deleteTask(todolistID, taskID)
      .then(() => dispatch(removeTaskAC(todolistID, taskID)));

export const createTaskTC =
  (todolistID: string, title: string) => (dispatch: Dispatch) =>
    tasksAPI
      .createTask(todolistID, title)
      .then((res) => dispatch(addTaskAC(res.data.data.item)));

export const updateTaskTC =
  (
    todolistID: string,
    taskID: string,
    updateModel: Omit<
      Partial<UpdateTaskModelType>,
      "startDate" | "description" | "deadline" | "priority"
    >,
  ) =>
  (dispatch: Dispatch, getState: () => RootStateType) => {
    const task = getState().tasks[todolistID].find((t) => t.id === taskID);

    if (!task) {
      console.warn("Task has not been found in state");
      return;
    }

    const apiModel: UpdateTaskModelType = {
      status: task.status,
      title: task.title,
      startDate: task.startDate,
      deadline: task.deadline,
      priority: task.priority,
      description: task.description,
      ...updateModel,
    };

    tasksAPI
      .updateTask(todolistID, taskID, apiModel)
      .then(() => dispatch(changeTaskAC(todolistID, taskID, apiModel)));
  };
