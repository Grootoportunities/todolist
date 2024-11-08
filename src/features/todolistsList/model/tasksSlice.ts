import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  tasksAPI,
  TasksStateType,
  TaskType,
  UpdateTaskModelType,
} from "../api";
import { clearTasksAndTodolists } from "common/actions";
import {
  createAppAsyncThunk,
  handleServerAppError,
  handleServerNetworkError,
} from "common/utils";
import { RootState } from "app/store";
import { todolistsActions } from "./todolistsSlice";
import { ResultCode, StatusesType } from "common/enums";
import { appActions } from "app/model";
import {
  DeleteTaskThunk,
  UpdateTaskThunk,
} from "features/todolistsList/model/types";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
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
      .addCase(todolistsActions.createTodolist.fulfilled, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(todolistsActions.deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload];
      })
      .addCase(todolistsActions.fetchTodolists.fulfilled, (state, action) => {
        action.payload.forEach((tl) => (state[tl.id] = []));
      })
      .addCase(clearTasksAndTodolists, () => {
        return {};
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistID] = action.payload.tasks;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistID].findIndex(
          (t) => t.id === action.payload.taskID,
        );

        if (index !== -1) state[action.payload.todolistID].splice(index, 1);
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistID];
        const index = tasks.findIndex((t) => t.id === action.payload.taskID);

        if (index !== -1)
          tasks[index] = {
            ...tasks[index],
            ...action.payload.model,
          };
      }),
});

//THUNKS

const fetchTasks = createAppAsyncThunk<
  { todolistID: string; tasks: TaskType[] },
  string
>("tasks/fetchTasks", async (todolistID, { dispatch, rejectWithValue }) => {
  dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
  try {
    const res = await tasksAPI.getTasks(todolistID);
    dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

    return { todolistID, tasks: res.data.items };
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

const deleteTask = createAppAsyncThunk<DeleteTaskThunk, DeleteTaskThunk>(
  "tasks/deleteTask",
  async (arg, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
    dispatch(
      tasksActions.setTaskEntityStatus({
        ...arg,
        status: StatusesType.LOADING,
      }),
    );

    try {
      const res = await tasksAPI.deleteTask(arg);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

        return arg;
      }

      dispatch(
        tasksActions.setTaskEntityStatus({
          ...arg,
          status: StatusesType.FAILED,
        }),
      );
      handleServerAppError(dispatch, res.data);

      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    } catch (err) {
      dispatch(
        tasksActions.setTaskEntityStatus({
          ...arg,
          status: StatusesType.FAILED,
        }),
      );
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

const createTask = createAppAsyncThunk<
  TaskType,
  { todolistID: string; title: string }
>("tasks/createTask", async (arg, { dispatch, rejectWithValue }) => {
  dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await tasksAPI.createTask(arg);
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

      return res.data.data.item;
    }

    handleServerAppError(dispatch, res.data, false);
    return rejectWithValue({
      errors: res.data.messages,
      fieldsErrors: res.data.fieldsErrors,
    });
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

const updateTask = createAppAsyncThunk<
  UpdateTaskThunk<UpdateTaskModelType>,
  UpdateTaskThunk<
    Pick<
      Partial<UpdateTaskModelType>,
        | "status" | "title"
    >
  >
>("tasks/updateTask", async (arg, { dispatch, rejectWithValue, getState }) => {
  const state = getState() as RootState;
  const { todolistID, taskID, model } = arg;
  const task = state.tasks[todolistID].find((t) => t.id === taskID);

  if (!task) {
    console.warn("Task has not been found in state");
    return rejectWithValue(null);
  }

  const apiModel: UpdateTaskModelType = {
    status: task.status,
    title: task.title,
    startDate: task.startDate,
    deadline: task.deadline,
    priority: task.priority,
    description: task.description,
    ...model,
  };

  dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
  dispatch(
    tasksActions.setTaskEntityStatus({
      todolistID,
      taskID,
      status: StatusesType.LOADING,
    }),
  );

  try {
    const res = await tasksAPI.updateTask(todolistID, taskID, apiModel);
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));
      dispatch(
        tasksActions.setTaskEntityStatus({
          todolistID,
          taskID,
          status: StatusesType.SUCCEEDED,
        }),
      );

      return {
        todolistID,
        taskID,
        model: apiModel,
      };
    }

    dispatch(
      tasksActions.setTaskEntityStatus({
        todolistID,
        taskID,
        status: StatusesType.FAILED,
      }),
    );

    handleServerAppError(dispatch, res.data);
    return rejectWithValue({
      errors: res.data.messages,
      fieldsErrors: res.data.fieldsErrors,
    });
  } catch (err) {
    dispatch(
      tasksActions.setTaskEntityStatus({
        todolistID,
        taskID,
        status: StatusesType.FAILED,
      }),
    );
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const tasksSlice = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { updateTask, createTask, deleteTask, fetchTasks };
