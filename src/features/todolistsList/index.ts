import * as todolistsSelectors from "./todolists.selectors";
import * as tasksSelectors from "./tasks.selectors";
import {
  todolistsThunks,
  todolistsActions,
  todolistsReducer,
} from "./todolists-reducer";
import { tasksActions, tasksThunks, tasksReducer } from "./tasks-reducer";
import { TodolistsList } from "./TodolistsList";

export {
  todolistsSelectors,
  todolistsThunks,
  todolistsActions,
  todolistsReducer,
  tasksSelectors,
  tasksActions,
  tasksThunks,
  tasksReducer,
  TodolistsList,
};
