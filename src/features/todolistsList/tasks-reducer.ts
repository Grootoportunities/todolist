import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from "./todolists-reducer";
import {
  tasksAPI,
  TasksStateType,
  TaskType,
  UpdateTaskModelType,
} from "../../api/tasksAPI";
import { AppThunksType, RootStateType } from "../../app/store";
import { setAppStatusAC, StatusesType } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: TasksActionsType,
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
    case "SET-TODOLISTS":
      return action.todolists.reduce(
        (acc, tl) => ({ ...acc, [tl.id]: [] }),
        {},
      );
    case "SET-TASKS":
      return { ...state, [action.todolistID]: action.tasks };
    case "SET-TASK-ENTITY-STATUS":
      return {
        ...state,
        [action.todolistID]: state[action.todolistID].map((t) =>
          t.id === action.taskID ? { ...t, entityStatus: action.status } : t,
        ),
      };
    default:
      return state;
  }
};

//ACTIONS

export const removeTaskAC = (todolistID: string, taskID: string) =>
  ({ type: "REMOVE-TASK", todolistID, taskID }) as const;

export const addTaskAC = (task: TaskType) =>
  ({ type: "ADD-TASK", task }) as const;

export const setTasksAC = (todolistID: string, tasks: TaskType[]) =>
  ({ type: "SET-TASKS", tasks, todolistID }) as const;

export const changeTaskAC = (
  todolistID: string,
  taskID: string,
  model: UpdateTaskModelType,
) => ({ type: "CHANGE-TASK", todolistID, taskID, model }) as const;

export const setTaskEntityStatusAC = (
  todolistID: string,
  taskID: string,
  status: StatusesType,
) => ({ type: "SET-TASK-ENTITY-STATUS", todolistID, taskID, status }) as const;

//THUNKS

export const fetchTasksTC =
  (todolistID: string): AppThunksType =>
  (dispatch) => {
    dispatch(setAppStatusAC(StatusesType.LOADING));

    tasksAPI
      .getTasks(todolistID)
      .then((res) => {
        dispatch(setTasksAC(todolistID, res.data.items));
        dispatch(setAppStatusAC(StatusesType.SUCCEEDED));
      })
      .catch((err) => handleServerNetworkError(dispatch, err.message));
  };

export const deleteTaskTC =
  (todolistID: string, taskID: string): AppThunksType =>
  (dispatch) => {
    dispatch(setAppStatusAC(StatusesType.LOADING));
    dispatch(setTaskEntityStatusAC(todolistID, taskID, StatusesType.LOADING));

    tasksAPI
      .deleteTask(todolistID, taskID)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(removeTaskAC(todolistID, taskID));
          dispatch(setAppStatusAC(StatusesType.SUCCEEDED));

          return;
        }

        dispatch(
          setTaskEntityStatusAC(todolistID, taskID, StatusesType.FAILED),
        );
        handleServerAppError(dispatch, res.data);
      })
      .catch((err) => {
        dispatch(
          setTaskEntityStatusAC(todolistID, taskID, StatusesType.FAILED),
        );
        handleServerNetworkError(dispatch, err.message);
      });
  };

export const createTaskTC =
  (todolistID: string, title: string): AppThunksType =>
  (dispatch) => {
    dispatch(setAppStatusAC(StatusesType.LOADING));

    tasksAPI
      .createTask(todolistID, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTaskAC(res.data.data.item));
          dispatch(setAppStatusAC(StatusesType.SUCCEEDED));

          return;
        }

        handleServerAppError(dispatch, res.data);
      })
      .catch((err) => handleServerNetworkError(dispatch, err.message));
  };

export const updateTaskTC =
  (
    todolistID: string,
    taskID: string,
    updateModel: Omit<
      Partial<UpdateTaskModelType>,
      "startDate" | "description" | "deadline" | "priority"
    >,
  ): AppThunksType =>
  (dispatch, getState: () => RootStateType) => {
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

    dispatch(setAppStatusAC(StatusesType.LOADING));
    dispatch(setTaskEntityStatusAC(todolistID, taskID, StatusesType.LOADING));

    tasksAPI
      .updateTask(todolistID, taskID, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(changeTaskAC(todolistID, taskID, apiModel));
          dispatch(setAppStatusAC(StatusesType.SUCCEEDED));
          dispatch(
            setTaskEntityStatusAC(todolistID, taskID, StatusesType.SUCCEEDED),
          );

          return;
        }

        dispatch(
          setTaskEntityStatusAC(todolistID, taskID, StatusesType.FAILED),
        );

        handleServerAppError(dispatch, res.data);
      })
      .catch((err) => {
        dispatch(
          setTaskEntityStatusAC(todolistID, taskID, StatusesType.FAILED),
        );

        handleServerNetworkError(dispatch, err.message);
      });
  };

//TYPES

export type TasksActionsType =
  | ReturnType<typeof changeTaskAC>
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof setTaskEntityStatusAC>;