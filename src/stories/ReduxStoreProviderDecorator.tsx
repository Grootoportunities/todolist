import { Provider } from "react-redux";
import { RootStateType } from "../state/store";
import { combineReducers, createStore } from "redux";
import { tasksReducer } from "../state/tasks-reducer";
import { todolistsReducer } from "../state/todolists-reducer";
import { v1 } from "uuid";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});

const initialGlobalState: RootStateType = {
  todolists: [
    { id: "todolistId1", hat: "What to learn", filter: "all" },
    { id: "todolistId2", hat: "What to buy", filter: "all" },
  ],
  tasks: {
    ["todolistId1"]: [
      { id: v1(), name: "HTML&CSS", checked: true },
      { id: v1(), name: "JS", checked: false },
    ],
    ["todolistId2"]: [
      { id: v1(), name: "Milk", checked: false },
      { id: v1(), name: "React Book", checked: true },
    ],
  },
};

export const storyBookStore = createStore(
  rootReducer,
  initialGlobalState as any,
);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
  <Provider store={storyBookStore}>{storyFn()}</Provider>
);
