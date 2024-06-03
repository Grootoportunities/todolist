import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {appActions} from "../../../app/model/appSlice";
import {AppDispatch} from "../../../app/store";
import {clearTasksAndTodolists} from "../../../common/actions";
import {StatusesType} from "../../../common/enums";
import {ThunkAPIConfigType} from "../../../common/types";
import {handleServerAppError, handleServerNetworkError} from "../../../common/utils";
import {authAPI} from "../api/authAPI";
import {LoginParamsType} from "../api/types";

//TODO: Тайпскрипт не типизирует автоматически slice!
const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(setLogin.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(deleteLogin.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(initApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      }),
});

// THUNKS
//TODO: Если в типизации санки третьим параметром я передам объект, в котором хранится типизация state и dispatch, то
// начинает ругаться на slice, extraReducers, санку и authSlice (если я передаю объект, в котором лишь типизация
// rejectValue, то не ругается). В store также ругается на сам store, а вот RootState как будто ругается на циклическую
// зависимость. Если я использую createAppAsyncThunk, где с withTypes используется третий параметр - тоже ругается.
const initApp = createAsyncThunk<
  boolean,
  undefined,
  ThunkAPIConfigType
  //TODO: Если в санке в первый параметр написать `${slice.name}/initApp` - тоже начнёт ругаться. Но в сторе никаких
  // проблем не будет.
  // !!ОБРАТИ ВНИМАНИЕ: В слайсе тудулиста, если я пишу первый параметр через slice.name, то оно не
  // ругается. Разницу, которую я заметил: в слайсе тудулиста, тайпскрипт типизирует слайс автоматически. В данном
  // слайсе - не типизирует.
>("auth/initApp", async (_, { dispatch, rejectWithValue }) => {
  //TODO: Такой костыль (thunkAPI.dispatch as AppDispatch) мне подсказали на саппорте: взять из thunkAPI dispatch и
  // сделать его как AppDispatch.

  // const dispatch = thunkAPI.dispatch as AppDispatch;
  // const rejectWithValue = thunkAPI.rejectWithValue;

  try {
    const res = await authAPI.init();
    if (res.data.resultCode === 0) {
      return true;
    } else if (res.data.messages[0] === "You are not authorized") {
      dispatch(appActions.setAppStatus({ status: StatusesType.FAILED }));

      return rejectWithValue(null);
    }

    handleServerAppError(dispatch, res.data);
    return rejectWithValue({
      errors: res.data.messages,
      fieldsErrors: res.data.fieldsErrors,
    });
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppInit({ isInit: true }));
  }
});

const setLogin = createAsyncThunk<boolean, LoginParamsType, ThunkAPIConfigType>(
  `auth/setLogin`,
  async (data, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const rejectWithValue = thunkAPI.rejectWithValue;

    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

    try {
      const res = await authAPI.setLogin(data);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

        return true;
      }

      handleServerAppError<{ userId?: number }>(dispatch, res.data);
      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  },
);

const deleteLogin = createAsyncThunk<boolean, undefined, ThunkAPIConfigType>(
  "auth/deleteLogin",
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch as AppDispatch;
    const rejectWithValue = thunkAPI.rejectWithValue;

    dispatch(appActions.setAppStatus({ status: StatusesType.LOADING }));

    try {
      const res = await authAPI.deleteLogin();
      if (res.data.resultCode === 0) {
        dispatch(clearTasksAndTodolists());
        dispatch(appActions.setAppStatus({ status: StatusesType.SUCCEEDED }));

        return false;
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
  },
);

export const authReducer = slice.reducer;
export const authThunks = { deleteLogin, setLogin, initApp };
