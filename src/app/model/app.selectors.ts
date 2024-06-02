import { RootState } from "../store";

export const selectStatus = (state: RootState) => state.app.status;
export const selectIsInit = (state: RootState) => state.app.isInit;
