import {
  addTask,
  changeTask,
  removeTask,
  setTaskEntityStatus,
  setTasks,
  tasksReducer,
} from "./tasks-reducer";

import {
  TaskPriorities,
  TasksStateType,
  TaskStatuses,
} from "../../api/tasksAPI";
import { StatusesType } from "../../app/app-reducer";
import { addTodolist, removeTodolist, setTodolists } from "./todolists-reducer";

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
        entityStatus: StatusesType.IDLE,
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
        entityStatus: StatusesType.IDLE,
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
        entityStatus: StatusesType.IDLE,
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
        entityStatus: StatusesType.IDLE,
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
        entityStatus: StatusesType.IDLE,
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
        entityStatus: StatusesType.LOADING,
      },
    ],
  };
});

test("Task should be de" + "leted correctly", () => {
  const endState = tasksReducer(
    startState,
    removeTask({ todolistID: "todolistID1", taskID: "2" }),
  );

  expect(endState["todolistID1"].length).toBe(2);
  expect(endState["todolistID2"].length).toBe(3);
  expect(endState["todolistID1"].every((t) => t.id != "2")).toBeTruthy();
});

test("Task should be added correctly", () => {
  const endState = tasksReducer(
    startState,
    addTask({
      id: "4",
      title: "New Task",
      status: TaskStatuses.New,
      description: "Task",
      todoListId: "todolistID2",
      order: 0,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      addedDate: "",
      entityStatus: StatusesType.IDLE,
    }),
  );

  expect(endState["todolistID1"].length).toBe(3);
  expect(endState["todolistID2"].length).toBe(4);
  expect(endState["todolistID2"][3].title).toBe("New Task");
});

test("Task isDone should change correctly", () => {
  expect(startState["todolistID2"][2].status).toBe(TaskStatuses.New);

  const endState = tasksReducer(
    startState,
    changeTask({
      todolistID: "todolistID2",
      taskID: "3",
      model: {
        title: "",
        status: TaskStatuses.Completed,
        description: "",
        deadline: "",
        priority: TaskPriorities.Low,
        startDate: "",
      },
    }),
  );

  expect(endState["todolistID2"][2].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistID1"][2].status).toBe(TaskStatuses.Completed);
});

test("Task title should change correctly", () => {
  const endState = tasksReducer(
    startState,
    changeTask({
      todolistID: "todolistID2",
      taskID: "3",
      model: {
        title: "New Title",
        status: TaskStatuses.Completed,
        description: "",
        deadline: "",
        priority: TaskPriorities.Low,
        startDate: "",
      },
    }),
  );

  expect(endState["todolistID2"][2].title).toBe("New Title");
  expect(endState["todolistID1"][2].title).toBe("Memento");
});

test("New empty array of task should be added when new todolist is added", () => {
  const endState = tasksReducer(
    startState,
    addTodolist({
      todolist: {
        ...startState["todolistID1"],
        id: "1",
        title: "Title",
        order: 0,
        addedDate: "",
      },
    }),
  );

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k !== "todolistID1" && k !== "todolistID2");
  if (!newKey) throw new Error("New key hasn't been found");

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("By deleting todolist, tasks also should be deleted", () => {
  const endState = tasksReducer(
    startState,
    removeTodolist({ todolistID: "todolistID2" }),
  );

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistID2"]).toBeUndefined();
});

test("Empty array should be added when todolists are setted", () => {
  const action = setTodolists({
    todolists: [
      { id: "1", title: "title1", order: 0, addedDate: "" },
      { id: "2", title: "title2", order: 0, addedDate: "" },
    ],
  });

  const endState = tasksReducer({}, action);
  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toStrictEqual([]);
  expect(endState["2"]).toStrictEqual([]);
});

test("Tasks should be set correctly", () => {
  const action = setTasks({
    todolistID: "todolistID1",
    tasks: startState["todolistID1"],
  });

  const endState = tasksReducer(
    {
      todolistID1: [],
      todolistID2: [],
    },
    action,
  );
  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["todolistID1"][0].title).toBe("Banshee Inisherin");
  expect(endState["todolistID1"][1].title).toBe("Kid of the human");
  expect(endState["todolistID2"]).toStrictEqual([]);
});

test("Task entity status should change", () => {
  const action = setTaskEntityStatus({
    todolistID: "todolistID1",
    taskID: "1",
    status: StatusesType.LOADING,
  });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistID1"][0].entityStatus).toBe(StatusesType.LOADING);
  expect(endState["todolistID1"][1].entityStatus).toBe(StatusesType.IDLE);
  expect(endState["todolistID1"][2].entityStatus).toBe(StatusesType.IDLE);
});
