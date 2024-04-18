import {
  addTodolistAC,
  setTodolistEntityStatusAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  FilterValuesType,
  removeTodolistAC,
  setTodolistsAC,
  TodolistDomainType,
  todolistsReducer,
} from "./todolists-reducer";
import { v1 } from "uuid";
import { StatusesType } from "../../app/app-reducer";

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
  const endState = todolistsReducer(startState, removeTodolistAC(todolistId1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  let newTodolistTitle = "New Todolist";

  const endState = todolistsReducer(startState, addTodolistAC(startState[0]));

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodolistTitle);
});

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist";

  const endState = todolistsReducer(
    startState,
    changeTodolistTitleAC(todolistId2, newTodolistTitle),
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "completed";

  const endState = todolistsReducer(
    startState,
    changeTodolistFilterAC(todolistId2, newFilter),
  );

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});

test("Todolists should be setted correctly", () => {
  const endState = todolistsReducer([], setTodolistsAC(startState));

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe("What to buy");
});

test("Todolist entity status should be changed", () => {
  expect(startState[0].entityStatus).toBe(StatusesType.IDLE);

  const endState = todolistsReducer(
    [],
    setTodolistEntityStatusAC(startState[0].id, StatusesType.LOADING),
  );

  expect(endState[0].entityStatus).toBe(StatusesType.LOADING);
  expect(endState[1].entityStatus).toBe(StatusesType.IDLE);
});
