import { instance } from "common/api";
import { ResponseType } from "common/types";
import { TodolistType } from "./types";
import { UpdateTodolistThunk } from "features/todolistsList/model";

export const todolistsAPI = {
  getTodolists: () => instance.get<TodolistType[]>("todo-lists"),

  createTodolist: (title: string) =>
    instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", {
      title,
    }),

  deleteTodolist: (ID: string) =>
    instance.delete<ResponseType>(`todo-lists/${ID}`),

  updateTodolist: (params: UpdateTodolistThunk) => {
    const { title, todolistID } = params;

    return instance.put<ResponseType>(`todo-lists/${todolistID}`, { title });
  },
};
