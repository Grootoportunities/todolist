import { tasksAPI } from "../api/tasksAPI";
import { AppDispatch, RootState } from "../../../../../../../app/store";
import { appActions } from "../../../../../../../app";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "../../../../../../../common/actions";
import { handleServerNetworkError } from "../../../../../../../common/utils";
import { todolistsThunks } from "../../../model/todolistsSlice";

import { StatusesType } from "../../../../../../../common/enums";
import { ThunkAPIConfigType } from "../../../../../../../common/types";
import { handleServerAppError } from "../../../../../../../common/utils";
import { TasksStateType, TaskType, UpdateTaskModelType } from "../api/types";

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
      .addCase(todolistsThunks.createTodolist.fulfilled, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(todolistsThunks.deleteTodolist.fulfilled, (state, action) => {
        delete state[action.payload];
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
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

const fetchTasks = createAsyncThunk<
  { todolistID: string; tasks: TaskType[] },
  string
>("tasks/fetchTasks", async (todolistID, { dispatch }) => {
  dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
  const res = await tasksAPI.getTasks(todolistID);
  dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

  return { todolistID, tasks: res.data.items };
});

const deleteTask = createAsyncThunk<DeleteTaskThunk, DeleteTaskThunk>(
  "tasks/deleteTask",
  async (arg, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
    dispatch(
      tasksActions.setTaskEntityStatus({
        ...arg,
        status: StatusesType.LOADING,
      }),
    );

    const res = await tasksAPI.deleteTask(arg.todolistID, arg.taskID);
    if (res.data.resultCode === 0) {
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

    return rejectWithValue(null);
  },
);

const createTask = createAsyncThunk<
  TaskType,
  { todolistID: string; title: string },
  ThunkAPIConfigType
>("tasks/createTask", async (arg, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatch;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await tasksAPI.createTask(arg.todolistID, arg.title);
    if (res.data.resultCode === 0) {
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

const updateTask = createAsyncThunk<
  UpdateTaskThunk<UpdateTaskModelType>,
  UpdateTaskThunk<
    Omit<
      Partial<UpdateTaskModelType>,
      "startDate" | "description" | "deadline" | "priority"
    >
  >,
  ThunkAPIConfigType
>("tasks/updateTask", async (arg, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatch;
  const rejectWithValue = thunkAPI.rejectWithValue;
  const state = thunkAPI.getState() as RootState;

  const task = state.tasks[arg.todolistID].find((t) => t.id === arg.taskID);

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
    ...arg.model,
  };

  dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));
  dispatch(
    tasksActions.setTaskEntityStatus({
      todolistID: arg.todolistID,
      taskID: arg.taskID,
      status: StatusesType.LOADING,
    }),
  );

  try {
    const res = await tasksAPI.updateTask(arg.todolistID, arg.taskID, apiModel);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));
      dispatch(
        tasksActions.setTaskEntityStatus({
          todolistID: arg.todolistID,
          taskID: arg.taskID,
          status: StatusesType.SUCCEEDED,
        }),
      );

      return {
        todolistID: arg.todolistID,
        taskID: arg.taskID,
        model: apiModel,
      };
    }

    dispatch(
      tasksActions.setTaskEntityStatus({
        todolistID: arg.todolistID,
        taskID: arg.taskID,
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
        todolistID: arg.todolistID,
        taskID: arg.taskID,
        status: StatusesType.FAILED,
      }),
    );
    //TODO: Сделать чтобы rejectWithValue возвращалось в handleServerNetworkError?
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const tasksSlice = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { updateTask, createTask, deleteTask, fetchTasks };

//TYPES

type DeleteTaskThunk = { todolistID: string; taskID: string };
type UpdateTaskThunk<T> = {
  todolistID: string;
  taskID: string;
  model: T;
};
