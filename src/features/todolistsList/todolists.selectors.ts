import { RootStateType } from "../../app/store";

export const selectTodolist = (state: RootStateType) => state.todolists;
