import { TasksStateType } from "../AppWithRedux/AppWithRedux";
import {
  addTaskAC,
  changeTaskIsDoneAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
} from "./tasks-reducer";
import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from "./todolists-reducer";
import { TaskPriorities, TaskStatuses } from "../api/tasksAPI";

let startState: TasksStateType;

beforeEach(() => {
  startState = {
    todolistID1: [
      {
        id: "1",
        title: "Banshee Inisherin",
        status: TaskStatuses.Completed,
        description: "Task",
        todoListId: "todolistID1",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "2",
        title: "Kid of the human",
        status: TaskStatuses.Completed,
        description: "Task",
        todoListId: "todolistID1",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "3",
        title: "Memento",
        status: TaskStatuses.Completed,
        description: "Task",
        todoListId: "todolistID1",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
    todolistID2: [
      {
        id: "1",
        title: "Grand Theft Auto: San Andreas",
        status: TaskStatuses.Completed,
        description: "Task",
        todoListId: "todolistID2",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "2",
        title: "Fallout 4",
        status: TaskStatuses.Completed,
        description: "Task",
        todoListId: "todolistID2",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
      {
        id: "3",
        title: "Baldur's Game 3",
        status: TaskStatuses.New,
        description: "Task",
        todoListId: "todolistID2",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        addedDate: "",
      },
    ],
  };
});

test("Task should be de" + "leted correctly", () => {
  const endState = tasksReducer(startState, removeTaskAC("todolistID1", "2"));

  expect(endState["todolistID1"].length).toBe(2);
  expect(endState["todolistID2"].length).toBe(3);
  expect(endState["todolistID1"].every((t) => t.id != "2")).toBeTruthy();
});

test("Task should be added correctly", () => {
  const endState = tasksReducer(
    startState,
    addTaskAC("todolistID1", "New Task"),
  );

  expect(endState["todolistID1"].length).toBe(4);
  expect(endState["todolistID2"].length).toBe(3);
  expect(endState["todolistID1"][3].title).toBe("New Task");
});

test("Task isDone should change correctly", () => {
  const endState = tasksReducer(
    startState,
    changeTaskIsDoneAC("todolistID2", "3", TaskStatuses.Completed),
  );

  expect(endState["todolistID2"][2].status).toBeTruthy();
  expect(endState["todolistID1"][2].status).toBeFalsy();
});

test("Task title should change correctly", () => {
  const endState = tasksReducer(
    startState,
    changeTaskTitleAC("todolistID2", "3", "New Title"),
  );

  expect(endState["todolistID2"][2].title).toBe("New Title");
  expect(endState["todolistID1"][2].title).toBe("Memento");
});

test("New empty array of task should be added when new todolist is added", () => {
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
  const endState = tasksReducer(startState, removeTodolistAC("todolistID2"));

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistID2"]).toBeUndefined();
});

test("Empty array should be added when todolists are setted", () => {
  const action = setTodolistsAC([
    { id: "1", title: "title1", order: 0, addedDate: "" },
    { id: "2", title: "title2", order: 0, addedDate: "" },
  ]);

  const endState = tasksReducer({}, action);
  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toStrictEqual([]);
  expect(endState["2"]).toStrictEqual([]);
});
