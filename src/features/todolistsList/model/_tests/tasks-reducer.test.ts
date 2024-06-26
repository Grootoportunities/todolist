import { tasksActions, tasksSlice, tasksThunks } from "../tasksSlice";
import { BaseActionType } from "common/types";
import { todolistsActions } from "../todolistsSlice";
import { StatusesType, TaskPriorities, TaskStatuses } from "common/enums";
import { TasksStateType } from "../../api";

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
        title: "Baldur's Gate 3",
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

test("Task should be deleted correctly", () => {
  const action: BaseActionType<typeof tasksThunks.deleteTask.fulfilled> = {
    type: tasksThunks.deleteTask.fulfilled.type,
    payload: { todolistID: "todolistID1", taskID: "2" },
  };

  const endState = tasksSlice(startState, action);

  expect(endState["todolistID1"].length).toBe(2);
  expect(endState["todolistID2"].length).toBe(3);
  expect(endState["todolistID1"].every((t) => t.id != "2")).toBeTruthy();
});

test("Task should be added correctly", () => {
  const action: BaseActionType<typeof tasksThunks.createTask.fulfilled> = {
    type: tasksThunks.createTask.fulfilled.type,
    payload: {
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
      entityStatus: StatusesType.LOADING,
    },
  };

  const endState = tasksSlice(startState, action);

  expect(endState["todolistID1"].length).toBe(3);
  expect(endState["todolistID2"].length).toBe(4);
  expect(endState["todolistID2"][0].title).toBe("New Task");
});

test("Task isDone should change correctly", () => {
  expect(startState["todolistID2"][2].status).toBe(TaskStatuses.New);

  const action: BaseActionType<typeof tasksThunks.updateTask.fulfilled> = {
    type: tasksThunks.updateTask.fulfilled.type,
    payload: {
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
    },
  };

  const endState = tasksSlice(startState, action);

  expect(endState["todolistID2"][2].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistID1"][2].status).toBe(TaskStatuses.Completed);
});

test("Task title should change correctly", () => {
  const action: BaseActionType<typeof tasksThunks.updateTask.fulfilled> = {
    type: tasksThunks.updateTask.fulfilled.type,
    payload: {
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
    },
  };

  const endState = tasksSlice(startState, action);

  expect(endState["todolistID2"][2].title).toBe("New Title");
  expect(endState["todolistID1"][2].title).toBe("Memento");
});

test("New empty array of task should be added when new todolist is added", () => {
  const action: BaseActionType<
    typeof todolistsActions.createTodolist.fulfilled
  > = {
    type: todolistsActions.createTodolist.fulfilled.type,
    payload: {
      ...startState["todolistID1"],
      id: "1",
      title: "Title",
      order: 0,
      addedDate: "",
    },
  };

  const endState = tasksSlice(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k !== "todolistID1" && k !== "todolistID2");
  if (!newKey) throw new Error("New key hasn't been found");

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("By deleting todolist, tasks also should be deleted", () => {
  const action: BaseActionType<
    typeof todolistsActions.deleteTodolist.fulfilled
  > = {
    type: todolistsActions.deleteTodolist.fulfilled.type,
    payload: "todolistID2",
  };

  const endState = tasksSlice(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistID2"]).toBeUndefined();
});

test("Empty array should be added when todolists are setted", () => {
  const action: BaseActionType<
    typeof todolistsActions.fetchTodolists.fulfilled
  > = {
    type: todolistsActions.fetchTodolists.fulfilled.type,
    payload: [
      { id: "1", title: "title1", order: 0, addedDate: "" },
      { id: "2", title: "title2", order: 0, addedDate: "" },
    ],
  };

  const endState = tasksSlice({}, action);
  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toStrictEqual([]);
  expect(endState["2"]).toStrictEqual([]);
});

test("Tasks should be set correctly", () => {
  const action: BaseActionType<typeof tasksThunks.fetchTasks.fulfilled> = {
    type: tasksThunks.fetchTasks.fulfilled.type,
    payload: { tasks: startState["todolistID1"], todolistID: "todolistID1" },
  };

  //     setTasks({
  //   todolistID: "todolistID1",
  //   tasks: startState["todolistID1"],
  // });

  const endState = tasksSlice(
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
  const action = tasksActions.setTaskEntityStatus({
    todolistID: "todolistID1",
    taskID: "1",
    status: StatusesType.LOADING,
  });

  const endState = tasksSlice(startState, action);

  expect(endState["todolistID1"][0].entityStatus).toBe(StatusesType.LOADING);
  expect(endState["todolistID1"][1].entityStatus).toBe(StatusesType.IDLE);
  expect(endState["todolistID1"][2].entityStatus).toBe(StatusesType.IDLE);
});
