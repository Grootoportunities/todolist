import {
  tasksAPI,
  TasksStateType,
  TaskType,
  UpdateTaskModelType,
} from "../../api/tasksAPI";
import { AppDispatchType, RootStateType } from "../../app/store";
import { setAppStatus, StatusesType } from "../../app/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createTodolistTC,
  deleteTodolistTC,
  fetchTodolistsTC,
} from "./todolists-reducer";
import { clearTasksAndTodolists } from "../../common/actions/common.actions";
import { handleServerAppError } from "../../utils/error-utils";
import { handleServerNetworkError } from "../../common/utils/handleServerNetworkError";
import { FieldsErrorsType } from "../../api/authAPI";

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
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload];
      })
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.forEach((tl) => (state[tl.id] = []));
      })
      .addCase(clearTasksAndTodolists, () => {
        return {};
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistID] = action.payload.tasks;
      })
      .addCase(deleteTaskTC.fulfilled, (state, action) => {
        const index = state[action.payload.todolistID].findIndex(
          (t) => t.id === action.payload.taskID,
        );

        if (index !== -1) state[action.payload.todolistID].splice(index, 1);
      })
      .addCase(createTaskTC.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload);
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistID];

        const index = tasks.findIndex((t) => t.id === action.payload.taskID);

        if (index !== -1)
          tasks[index] = {
            ...tasks[index],
            ...action.payload.model,
          };
      }),
});

export const tasksReducer = slice.reducer;
export const { setTaskEntityStatus } = slice.actions;

//THUNKS

export const fetchTasksTC = createAsyncThunk<
  { todolistID: string; tasks: TaskType[] },
  string
>("tasks/fetchTasksTC", async (todolistID, { dispatch }) => {
  dispatch(setAppStatus({ status: StatusesType.LOADING }));
  const res = await tasksAPI.getTasks(todolistID);
  dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

  return { todolistID, tasks: res.data.items };
});

type DeleteTaskTT = { todolistID: string; taskID: string };

export const deleteTaskTC = createAsyncThunk<DeleteTaskTT, DeleteTaskTT>(
  "tasks/deleteTaskTC",
  async (arg, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatus({ status: StatusesType.LOADING }));
    dispatch(setTaskEntityStatus({ ...arg, status: StatusesType.LOADING }));

    const res = await tasksAPI.deleteTask(arg.todolistID, arg.taskID);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

      return arg;
    }

    dispatch(
      setTaskEntityStatus({
        ...arg,
        status: StatusesType.FAILED,
      }),
    );
    handleServerAppError(dispatch, res.data);

    return rejectWithValue(null);
  },
);

export const createTaskTC = createAsyncThunk<
  TaskType,
  { todolistID: string; title: string },
  { rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null }
>("tasks/createTaskTC", async (arg, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await tasksAPI.createTask(arg.todolistID, arg.title);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

      return res.data.data.item;
    }

    handleServerAppError(dispatch, res.data);
    return rejectWithValue({
      errors: res.data.messages,
      fieldsErrors: res.data.fieldsErrors,
    });
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const updateTaskTC = createAsyncThunk<
  {
    todolistID: string;
    taskID: string;
    model: UpdateTaskModelType;
  },
  {
    todolistID: string;
    taskID: string;
    model: Omit<
      Partial<UpdateTaskModelType>,
      "startDate" | "description" | "deadline" | "priority"
    >;
  },
  {
    // state: RootStateType;
    rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null;
  }
>("tasks/updateTaskTC", async (arg, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;
  const state = thunkAPI.getState() as RootStateType;

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

  dispatch(setAppStatus({ status: StatusesType.LOADING }));
  dispatch(
    setTaskEntityStatus({
      todolistID: arg.todolistID,
      taskID: arg.taskID,
      status: StatusesType.LOADING,
    }),
  );

  try {
    const res = await tasksAPI.updateTask(arg.todolistID, arg.taskID, apiModel);
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));
      dispatch(
        setTaskEntityStatus({
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
      setTaskEntityStatus({
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
      setTaskEntityStatus({
        todolistID: arg.todolistID,
        taskID: arg.taskID,
        status: StatusesType.FAILED,
      }),
    );

    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});
