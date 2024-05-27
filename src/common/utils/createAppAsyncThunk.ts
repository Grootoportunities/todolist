import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatchType, RootStateType } from "../../app/store";
import { FieldsErrorsType } from "../../api/authAPI";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootStateType;
  dispatch: AppDispatchType;
  rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null;
}>();
