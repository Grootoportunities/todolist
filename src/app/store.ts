import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "../features/auth/model/authSlice";
import {todolistsReducer} from "../features/todolistsList/ui/todolist/model/todolistsSlice";
import {tasksSlice} from "../features/todolistsList/ui/todolist/ui/task";
import {appReducer} from "./model/appSlice";


export const store = configureStore({
	reducer: {
		todolists: todolistsReducer,
		tasks: tasksSlice,
		app: appReducer,
		auth: authReducer,
	},
});

//1. Переустановить Node modules
//2. Поменять версию тайпскрипта (вниз/вверх (4.4 или 5 и т.д))
//3. Удалить и переустановить тайпскрипт глобально
//4. Переустановить WebStorm
//5. Винду :c

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
