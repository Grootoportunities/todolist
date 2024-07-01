import { createAsyncThunk } from "@reduxjs/toolkit";
import { FieldsErrorsType } from "features/auth/api";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null;
}>();

// export const createAppAsyncThunk = createAsyncThunk.withTypes<{
//   state: RootState;
//   dispatch: AppDispatch;
//   rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null;
// }>();
