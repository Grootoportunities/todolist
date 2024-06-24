import { configureStore } from "@reduxjs/toolkit";
import { tasksSlice, todolistsSlice } from "../features/todolistsList/model";
import { appSlice } from "./model";
import { authSlice } from "../features/auth/model";

export const store = configureStore({
  reducer: {
    todolists: todolistsSlice,
    tasks: tasksSlice,
    app: appSlice,
    auth: authSlice,
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
