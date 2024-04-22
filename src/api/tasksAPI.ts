import axios from "axios";
import { StatusesType } from "../app/app-reducer";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/todo-lists/",
  withCredentials: true,
  headers: { "API-KEY": "0ec2bc57-903d-45af-82a6-939602d241d5" },
});

//API

export const tasksAPI = {
  getTasks: (todolistID: string) =>
    instance.get<GetTasksResponseType>(`${todolistID}/tasks`),

  createTask: (todolistID: string, title: string) =>
    instance.post<CUDResponseType<{ item: TaskType }>>(`${todolistID}/tasks`, {
      title,
    }),

  deleteTask: (todolistID: string, taskID: string) =>
    instance.delete<CUDResponseType>(`${todolistID}/tasks/${taskID}`),

  updateTask: (
    todolistID: string,
    taskID: string,
    model: UpdateTaskModelType,
  ) => instance.put<CUDResponseType>(`${todolistID}/tasks/${taskID}`, model),
};

//TYPES

export enum TaskStatuses {
  New,
  InProgress,
  Completed,
  Draft,
}

export enum TaskPriorities {
  Low,
  Middle,
  High,
  Urgently,
  Later,
}
export type TaskType = {
  id: string;
  title: string;
  description: string;
  todoListId: string;
  order: number;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  addedDate: string;
  entityStatus: StatusesType;
};
export type TasksStateType = { [key: string]: TaskType[] };
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: number;
  priority: number;
  startDate: string;
  deadline: string;
};
type GetTasksResponseType = {
  items: TaskType[];
  totalCount: number;
  error: string | null;
};
export type CUDResponseType<D = {}> = {
  data: D;
  messages: string[];
  fieldsErrors: string[];
  resultCode: number;
};
