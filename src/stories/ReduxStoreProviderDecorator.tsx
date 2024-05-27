import { Provider } from "react-redux";
import { RootStateType } from "../app/store";
import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { tasksReducer } from "../features/todolistsList/tasks-reducer";
import { todolistsReducer } from "../features/todolistsList/todolists-reducer";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses } from "../api/tasksAPI";
import { appReducer, StatusesType } from "../app/app-reducer";
import { thunk } from "redux-thunk";
import { authReducer } from "../features/auth/auth-reducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  login: authReducer,
  auth: authReducer,
});

const initialGlobalState: RootStateType = {
  todolists: [
    {
      id: "todolistId1",
      title: "What to learn",
      filter: "all",
      order: 0,
      addedDate: "",
      entityStatus: StatusesType.IDLE,
    },
    {
      id: "todolistId2",
      title: "What to buy",
      filter: "all",
      order: 0,
      addedDate: "",
      entityStatus: StatusesType.LOADING,
    },
  ],
  tasks: {
    ["todolistId1"]: [
      {
        todoListId: "todolistId1",
        id: v1(),
        title: "CSS",
        status: TaskStatuses.Completed,
        startDate: "",
        addedDate: "",
        deadline: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "New Task",
        entityStatus: StatusesType.IDLE,
      },
      {
        todoListId: "todolistId1",
        id: v1(),
        title: "JS",
        status: TaskStatuses.Completed,
        startDate: "",
        addedDate: "",
        deadline: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "New Task",
        entityStatus: StatusesType.IDLE,
      },
    ],
    ["todolistId2"]: [
      {
        todoListId: "todolistId2",
        id: v1(),
        title: "Milk",
        status: TaskStatuses.Completed,
        startDate: "",
        addedDate: "",
        deadline: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "New Task",
        entityStatus: StatusesType.IDLE,
      },
      {
        todoListId: "todolistId2",
        id: v1(),
        title: "CSS",
        status: TaskStatuses.Completed,
        startDate: "",
        addedDate: "",
        deadline: "",
        order: 0,
        priority: TaskPriorities.Low,
        description: "React Book",
        entityStatus: StatusesType.LOADING,
      },
    ],
  },
  app: {
    status: StatusesType.IDLE,
    error: null,
    isInit: false,
  },
  auth: { isLoggedIn: false },
};

export const storyBookStore = legacy_createStore(
  rootReducer,
  initialGlobalState as RootStateType & undefined,
  applyMiddleware(thunk),
);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
  <Provider store={storyBookStore}>{storyFn()}</Provider>
);
