import { TasksStateType } from "../App";
import {
  addTaskAC,
  changeTaskIsDoneAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
} from "./tasks-reducer";
import { addTodolistAC, removeTodolistAC } from "./todolists-reducer";

test("Task should be deleted correctly", () => {
  const startState: TasksStateType = {
    todolistID1: [
      { id: "1", name: "Banshee Inisherin", checked: true },
      { id: "2", name: "Kid of the human", checked: true },
      { id: "3", name: "Memento", checked: true },
    ],
    todolistID2: [
      { id: "1", name: "Grand Theft Auto: San Andreas", checked: true },
      { id: "2", name: "Fallout 4", checked: true },
      { id: "3", name: "Baldur's Game 3", checked: false },
    ],
  };

  const endState = tasksReducer(startState, removeTaskAC("todolistID1", "2"));

  expect(endState["todolistID1"].length).toBe(2);
  expect(endState["todolistID2"].length).toBe(3);
  expect(endState["todolistID1"].every((t) => t.id != "2")).toBeTruthy();
});

test("Task should be added correctly", () => {
  const startState: TasksStateType = {
    todolistID1: [
      { id: "1", name: "Banshee Inisherin", checked: true },
      { id: "2", name: "Kid of the human", checked: true },
      { id: "3", name: "Memento", checked: true },
    ],
    todolistID2: [
      { id: "1", name: "Grand Theft Auto: San Andreas", checked: true },
      { id: "2", name: "Fallout 4", checked: true },
      { id: "3", name: "Baldur's Game 3", checked: false },
    ],
  };

  const endState = tasksReducer(
    startState,
    addTaskAC("todolistID1", "New Task"),
  );

  expect(endState["todolistID1"].length).toBe(4);
  expect(endState["todolistID2"].length).toBe(3);
  expect(endState["todolistID1"][3].name).toBe("New Task");
});

test("Task isDone should change correctly", () => {
  const startState: TasksStateType = {
    todolistID1: [
      { id: "1", name: "Banshee Inisherin", checked: true },
      { id: "2", name: "Kid of the human", checked: true },
      { id: "3", name: "Memento", checked: false },
    ],
    todolistID2: [
      { id: "1", name: "Grand Theft Auto: San Andreas", checked: true },
      { id: "2", name: "Fallout 4", checked: true },
      { id: "3", name: "Baldur's Game 3", checked: false },
    ],
  };

  const endState = tasksReducer(
    startState,
    changeTaskIsDoneAC("todolistID2", "3", true),
  );

  expect(endState["todolistID2"][2].checked).toBeTruthy();
  expect(endState["todolistID1"][2].checked).toBeFalsy();
});

test("Task title should change correctly", () => {
  const startState: TasksStateType = {
    todolistID1: [
      { id: "1", name: "Banshee Inisherin", checked: true },
      { id: "2", name: "Kid of the human", checked: true },
      { id: "3", name: "Memento", checked: false },
    ],
    todolistID2: [
      { id: "1", name: "Grand Theft Auto: San Andreas", checked: true },
      { id: "2", name: "Fallout 4", checked: true },
      { id: "3", name: "Baldur's Game 3", checked: false },
    ],
  };

  const endState = tasksReducer(
    startState,
    changeTaskTitleAC("todolistID2", "3", "New Title"),
  );

  expect(endState["todolistID2"][2].name).toBe("New Title");
  expect(endState["todolistID1"][2].name).toBe("Memento");
});

test("New empty array of task should be added when new todolist is added", () => {
  const startState: TasksStateType = {
    todolistID1: [
      { id: "1", name: "Banshee Inisherin", checked: true },
      { id: "2", name: "Kid of the human", checked: true },
      { id: "3", name: "Memento", checked: false },
    ],
    todolistID2: [
      { id: "1", name: "Grand Theft Auto: San Andreas", checked: true },
      { id: "2", name: "Fallout 4", checked: true },
      { id: "3", name: "Baldur's Game 3", checked: false },
    ],
  };

  const endState = tasksReducer(
    startState,
    addTodolistAC("New Todolist Title"),
  );

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k !== "todolistID1" && k !== "todolistID2");
  if (!newKey) throw new Error("New key hasn't been found");

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("By deleting todolist, tasks also should be deleted", () => {
  const startState: TasksStateType = {
    todolistID1: [
      { id: "1", name: "Banshee Inisherin", checked: true },
      { id: "2", name: "Kid of the human", checked: true },
      { id: "3", name: "Memento", checked: false },
    ],
    todolistID2: [
      { id: "1", name: "Grand Theft Auto: San Andreas", checked: true },
      { id: "2", name: "Fallout 4", checked: true },
      { id: "3", name: "Baldur's Game 3", checked: false },
    ],
  };

  const endState = tasksReducer(startState, removeTodolistAC("todolistID2"));

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistID2"]).toBeUndefined();
});
