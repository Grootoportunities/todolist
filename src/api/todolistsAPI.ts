import axios from "axios";
import { FieldsErrorsType } from "./authAPI";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
  withCredentials: true,
  headers: { "API-KEY": "3756001f-ecb0-4826-81eb-5a9af639abe5" },
});

//API

export const todolistsAPI = {
  getTodolists: () => instance.get<TodolistType[]>(""),

  createTodolist: (title: string) =>
    instance.post<ResponseType<{ item: TodolistType }>>("", { title }),

  deleteTodolist: (ID: string) => instance.delete<ResponseType>(`/${ID}`),

  updateTodolist: (ID: string, title: string) =>
    instance.put<ResponseType>(`/${ID}`, { title }),
};

//TYPES

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
type ResponseType<D = {}> = {
  data: D;
  messages: string[];
  fieldsErrors: FieldsErrorsType[];
  resultCode: number;
};
