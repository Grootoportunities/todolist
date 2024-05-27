import {
  TodolistDomainType,
  todolistsReducer,
  todolistsThunks,
} from "./todolists-reducer";
import { tasksReducer } from "./tasks-reducer";
import { TasksStateType } from "../../api/tasksAPI";
import { BaseActionType } from "../../common/types/types";

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

  const endTodolistState = todolistsReducer(startTodolistsState, action);
  const endTasksState = tasksReducer(startTasksState, action);

  const keys = Object.keys(endTasksState);
  const idFromTodolist = endTodolistState[0].id;
  const idFromTasks = keys[0];

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodolist).toBe(action.payload.id);
});
