import axios from "axios";

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

type ResponseType<D = {}> = {
  data: D;
  messages: string[];
  fieldsErrors: string[];
  resultCode: number;
};

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists",
  withCredentials: true,
  headers: { "API-KEY": "0ec2bc57-903d-45af-82a6-939602d241d5" },
});

export const todolistsAPI = {
  getTodolists: () => instance.get<TodolistType[]>(""),

  createTodolist: (title: string) =>
    instance.post<ResponseType<{ item: TodolistType }>>("", { title }),

  deleteTodolist: (ID: string) => instance.delete<ResponseType>(`/${ID}`),

  updateTodolist: (ID: string, title: string) =>
    instance.put<ResponseType>(`/${ID}`, { title }),
};