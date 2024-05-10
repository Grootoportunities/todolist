import { authAPI, FieldsErrorsType, LoginParamsType } from "../../api/authAPI";
import { setAppStatus, StatusesType } from "../../app/app-reducer";
import { handleServerAppError } from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { clearTasksAndTodolists } from "../../common/actions/common.actions";
import { handleServerNetworkError } from "../../common/utils/handleServerNetworkError";
import { AppDispatchType } from "../../app/store";

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    setLogin: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(setLoginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    }),
});

export const authReducer = slice.reducer;
export const { setLogin } = slice.actions;

// THUNKS

export const setLoginTC = createAsyncThunk<
  { isLoggedIn: boolean },
  LoginParamsType,
  { rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null }
  // { dispatch: AppDispatchType; state: RootStateType; rejectValue: null }
>(`auth/setLoginTC`, async (data, thunkAPI) => {
  const dispatch = thunkAPI.dispatch as AppDispatchType;
  const rejectWithValue = thunkAPI.rejectWithValue;

  dispatch(setAppStatus({ status: StatusesType.LOADING }));

  try {
    const res = await authAPI.setLogin(data);
    debugger;
    if (res.data.resultCode === 0) {
      // dispatch(setLogin({ isLoggedIn: true }));
      dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

      return { isLoggedIn: true };
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
});

// export const setLoginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
//   dispatch(setAppStatus({ status: StatusesType.LOADING }));
//   authAPI
//     .setLogin(data)
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(setLogin({ isLoggedIn: true }));
//         dispatch(clearTasksAndTodolists());
//         dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));
//
//         return;
//       }
//
//       handleServerAppError<{ userId?: number }>(dispatch, res.data);
//     })
//     .catch((err) => handleServerNetworkError(err, dispatch));
// };

export const deleteLoginTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: StatusesType.LOADING }));
  authAPI
    .deleteLogin()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setLogin({ isLoggedIn: false }));
        dispatch(clearTasksAndTodolists());
        dispatch(setAppStatus({ status: StatusesType.SUCCEEDED }));

        return;
      }

      handleServerAppError(dispatch, res.data);
    })
    .catch((err) => handleServerNetworkError(err, dispatch));
};
