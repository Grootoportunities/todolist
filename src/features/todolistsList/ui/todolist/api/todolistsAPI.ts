import { instance } from "../../../../../common/api";
import { ResponseType } from "../../../../../common/types";
import { TodolistType } from "./types";

export const todolistsAPI = {
  getTodolists: () => instance.get<TodolistType[]>("todo-lists"),

  createTodolist: (title: string) =>
    instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", {
      title,
    }),

  deleteTodolist: (ID: string) =>
    instance.delete<ResponseType>(`todo-lists/${ID}`),

  updateTodolist: (ID: string, title: string) =>
    instance.put<ResponseType>(`todo-lists/${ID}`, { title }),
};
