import {
  StatusesType,
  TaskPriorities,
  TaskStatuses,
} from "../../../common/enums";

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

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

export type GetTasksResponseType = {
  items: TaskType[];
  totalCount: number;
  error: string | null;
};
