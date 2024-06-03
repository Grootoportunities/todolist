import {
  todolistsActions,
  todolistsSlice,
  todolistsThunks,
} from "../todolistsSlice";
import { v1 } from "uuid";
import { BaseActionType } from "../../../../../../common/types";
import { StatusesType } from "../../../../../../common/enums";
import { FilterValuesType, TodolistDomainType } from "../types";

let todolistId1: string;
let todolistId2: string;
let startState: TodolistDomainType[];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();

  startState = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "all",
      order: 0,
      addedDate: "",
      entityStatus: StatusesType.IDLE,
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "all",
      order: 0,
      addedDate: "",
      entityStatus: StatusesType.IDLE,
    },
  ];
});

test("correct todolist should be removed", () => {
  const action: BaseActionType<
    typeof todolistsThunks.deleteTodolist.fulfilled
  > = {
    type: todolistsThunks.deleteTodolist.fulfilled.type,
    payload: todolistId1,
  };

  const endState = todolistsSlice(startState, action);

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  let newTodolistTitle = "New Todolist";

  const action: BaseActionType<
    typeof todolistsThunks.createTodolist.fulfilled
  > = {
    type: todolistsThunks.createTodolist.fulfilled.type,
    payload: {
      id: "todolistId3",
      title: newTodolistTitle,
      order: 0,
      addedDate: "",
    },
  };

  const endState = todolistsSlice(startState, action);

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodolistTitle);
});

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist";

  const action: BaseActionType<
    typeof todolistsThunks.updateTodolistTitle.fulfilled
  > = {
    type: todolistsThunks.updateTodolistTitle.fulfilled.type,
    payload: {
      todolistID: todolistId2,
      title: newTodolistTitle,
    },
  };

  const endState = todolistsSlice(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "completed";

  const endState = todolistsSlice(
    startState,
    todolistsActions.changeTodolistFilter({
      todolistID: todolistId2,
      filter: newFilter,
    }),
  );

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});

test("Todolists should be setted correctly", () => {
  const action: BaseActionType<
    typeof todolistsThunks.fetchTodolists.fulfilled
  > = {
    type: todolistsThunks.fetchTodolists.fulfilled.type,
    payload: startState,
  };

  const endState = todolistsSlice([], action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe("What to buy");
});

test("Todolist entity status should be changed", () => {
  expect(startState[0].entityStatus).toBe(StatusesType.IDLE);

  const endState = todolistsSlice(
    startState,
    todolistsActions.setTodolistEntityStatus({
      todolistID: todolistId1,
      status: StatusesType.LOADING,
    }),
  );

  expect(endState[0].entityStatus).toBe(StatusesType.LOADING);
  expect(endState[1].entityStatus).toBe(StatusesType.IDLE);
});
