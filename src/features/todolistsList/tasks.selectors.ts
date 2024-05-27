import { RootStateType } from "../../app/store";

export const selectTasks = (todolistID: string) => (state: RootStateType) =>
  state.tasks[todolistID];
