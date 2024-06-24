import { todolistsSlice, todolistsThunks } from "../todolistsSlice";
import { BaseActionType } from "../../../../common/types";
import { TodolistDomainType } from "../types";
import { TasksStateType } from "../../api";
import { tasksSlice } from "../tasksSlice";

test("ID's of tasks and todolists should be equal", () => {
  const startTodolistsState: TodolistDomainType[] = [];
  const startTasksState: TasksStateType = {};

  const action: BaseActionType<
    typeof todolistsThunks.createTodolist.fulfilled
  > = {
    type: todolistsThunks.createTodolist.fulfilled.type,
    payload: {
      id: "todolistId1",
      title: "What to learn",
      order: 0,
      addedDate: "",
    },
  };

  const endTodolistState = todolistsSlice(startTodolistsState, action);
  const endTasksState = tasksSlice(startTasksState, action);

  const keys = Object.keys(endTasksState);
  const idFromTodolist = endTodolistState[0].id;
  const idFromTasks = keys[0];

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodolist).toBe(action.payload.id);
});
