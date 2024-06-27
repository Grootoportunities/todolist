import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StatusesType } from "common/enums";

const slice = createSlice({
  name: "application",
  initialState: {
    status: StatusesType.IDLE,
    error: null as string | null,
    isInit: false,
  },
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: StatusesType }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppInit: (state, action: PayloadAction<{ isInit: boolean }>) => {
      state.isInit = action.payload.isInit;
    },
  },
});

export const appSlice = slice.reducer;
export const appActions = slice.actions;
