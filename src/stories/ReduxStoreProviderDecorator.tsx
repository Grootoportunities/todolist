import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {thunk} from "redux-thunk";
import {v1} from "uuid";
import {appReducer} from "../app/model/appSlice";
import {RootState} from "../app/store";
import {StatusesType, TaskPriorities, TaskStatuses} from "../common/enums";
import {authReducer} from "../features/auth/model/authSlice";
import {todolistsReducer} from "../features/todolistsList/ui/todolist/model/todolistsSlice";
import {tasksSlice} from "../features/todolistsList/ui/todolist/ui/task";


const rootReducer = combineReducers({
  tasks: tasksSlice,
  todolists: todolistsReducer,
  app: appReducer,
  login: authReducer,
  auth: authReducer,
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
