import { RootState } from "../../../app/store";

export const selectTasks = (todolistID: string) => (state: RootState) =>
  state.tasks[todolistID];
