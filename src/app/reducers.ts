import {combineReducers} from "redux";
import {tasksSlice, todolistsSlice} from "../features/todolistsList/model";
import {appSlice} from "./model";
import {authSlice} from "../features/auth/model";

export const reducer = combineReducers({
    todolists: todolistsSlice,
    tasks: tasksSlice,
    app: appSlice,
    auth: authSlice,
})