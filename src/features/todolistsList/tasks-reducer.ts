import {
  tasksAPI,
  TasksStateType,
  TaskType,
  UpdateTaskModelType,
} from "../../api/tasksAPI";
import { RootStateType } from "../../app/store";
import { setAppStatus, StatusesType } from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { Dispatch } from "redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addTodolist, removeTodolist, setTodolists } from "./todolists-reducer";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTask: (
      state,
      action: PayloadAction<{ todolistID: string; taskID: string }>,
    ) => {
      const index = state[action.payload.todolistID].findIndex(
        (t) => t.id === action.payload.taskID,
      );

      if (index !== -1) state[action.payload.todolistID].splice(index, 1);
    },
    addTask: (state, action: PayloadAction<TaskType>) => {
      state[action.payload.todoListId].push(action.payload);
    },
    changeTask: (
      state,
      action: PayloadAction<{
        todolistID: string;
        taskID: string;
        model: UpdateTaskModelType;
      }>,
    ) => {
      const tasks = state[action.payload.todolistID];

      const index = tasks.findIndex((t) => t.id === action.payload.taskID);

      if (index !== -1)
        tasks[index] = {
          ...tasks[index],
          ...action.payload.model,
        };
    },
    setTasks: (
      state,
      action: PayloadAction<{ todolistID: string; tasks: TaskType[] }>,
    ) => {
      state[action.payload.todolistID] = action.payload.tasks;
    },
    setTaskEntityStatus: (
      state,
      action: PayloadAction<{
        todolistID: string;
        taskID: string;
        status: StatusesType;
      }>,
    ) => {
      const tasks = state[action.payload.todolistID];
      const index = tasks.findIndex((t) => t.id === action.payload.taskID);

      tasks[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(removeTodolist, (state, action) => {
        delete state[action.payload.todolistID];
      })
      .addCase(setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => (state[tl.id] = []));
      }),
});

export const tasksReducer = slice.reducer;
export const {
  removeTask,
  setTasks,
  changeTask,
  setTaskEntityStatus,
  addTask,
} = slice.actions;

//THUNKS

export const fetchTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: StatusesType.LOADING }));

  tasksAPI
    .getTasks(todolistID)
    .then((res) => {
      dispatch(setTasks({ todolistID, tasks: res.data.items }));
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));
    })
    .catch((err) => handleServerNetworkError(dispatch, err.message));
};

export const deleteTaskTC =
  (todolistID: string, taskID: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: StatusesType.LOADING }));
    dispatch(
      setTaskEntityStatus({ todolistID, taskID, status: StatusesType.LOADING }),
    );

    tasksAPI
      .deleteTask(todolistID, taskID)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(removeTask({ todolistID, taskID }));
          dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

          return;
        }

        dispatch(
          setTaskEntityStatus({
            todolistID,
            taskID,
            status: StatusesType.FAILED,
          }),
        );
        handleServerAppError(dispatch, res.data);
      })
      .catch((err) => {
        dispatch(
          setTaskEntityStatus({
            todolistID,
            taskID,
            status: StatusesType.FAILED,
          }),
        );
        handleServerNetworkError(dispatch, err.message);
      });
  };

export const createTaskTC =
  (todolistID: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({ status: StatusesType.LOADING }));

    tasksAPI
      .createTask(todolistID, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTask(res.data.data.item));
          dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

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

    dispatch(setAppStatus({ status: StatusesType.LOADING }));
    dispatch(
      setTaskEntityStatus({ todolistID, taskID, status: StatusesType.LOADING }),
    );

    tasksAPI
      .updateTask(todolistID, taskID, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(changeTask({ todolistID, taskID, model: apiModel }));
          dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));
          dispatch(
            setTaskEntityStatus({
              todolistID,
              taskID,
              status: StatusesType.SUCCEEDED,
            }),
          );

          return;
        }

        dispatch(
          setTaskEntityStatus({
            todolistID,
            taskID,
            status: StatusesType.FAILED,
          }),
        );

        handleServerAppError(dispatch, res.data);
      })
      .catch((err) => {
        dispatch(
          setTaskEntityStatus({
            todolistID,
            taskID,
            status: StatusesType.FAILED,
          }),
        );

        handleServerNetworkError(dispatch, err.message);
      });
  };
