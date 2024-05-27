import { RootStateType } from "./store";

export const selectStatus = (state: RootStateType) => state.app.status;
export const selectIsInit = (state: RootStateType) => state.app.isInit;
