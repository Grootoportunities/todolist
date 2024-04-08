import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
} from "redux";
import { tasksReducer } from "./tasks-reducer";
import { todolistsReducer } from "./todolists-reducer";
import { thunk, ThunkDispatch } from "redux-thunk";
import { useDispatch } from "react-redux";

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export type RootStateType = ReturnType<typeof rootReducer>;
export type AppThunkDispatch = ThunkDispatch<RootStateType, any, AnyAction>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();

// @ts-ignore
window.store = store;
