import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "app/store";
import { FieldsErrorsType } from "features/auth/api";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null;
}>();
