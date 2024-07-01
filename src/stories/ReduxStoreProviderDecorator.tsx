import { Provider } from "react-redux";
import { RootState } from "app/store";
import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { v1 } from "uuid";
import { thunk } from "redux-thunk";
import { StatusesType, TaskPriorities, TaskStatuses } from "common/enums";
import { tasksSlice, todolistsSlice } from "features/todolistsList/model";
import { appSlice } from "app/model";
import { authSlice } from "features/auth/model";

const rootReducer = combineReducers({
  tasks: tasksSlice,
  todolists: todolistsSlice,
  app: appSlice,
  login: authSlice,
  auth: authSlice,
});

const initialGlobalState: RootState = {
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
  initialGlobalState as RootState & undefined,
  applyMiddleware(thunk),
);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
  <Provider store={storyBookStore}>{storyFn()}</Provider>
);
