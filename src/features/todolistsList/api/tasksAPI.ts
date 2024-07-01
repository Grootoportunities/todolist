import { instance } from "common/api";
import { ResponseType } from "common/types";
import { GetTasksResponseType, TaskType, UpdateTaskModelType } from "./types";

export const tasksAPI = {
  getTasks: (todolistID: string) =>
    instance.get<GetTasksResponseType>(`todo-lists/${todolistID}/tasks`),

  createTask: (params: { todolistID: string; title: string }) => {
    const { title, todolistID } = params;

    return instance.post<ResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistID}/tasks`,
      {
        title,
      },
    );
  },

  deleteTask: (params: { todolistID: string; taskID: string }) => {
    const { todolistID, taskID } = params;

    return instance.delete<ResponseType>(
      `todo-lists/${todolistID}/tasks/${taskID}`,
    );
  },

  updateTask: (
    todolistID: string,
    taskID: string,
    model: UpdateTaskModelType,
  ) =>
    instance.put<ResponseType>(
      `todo-lists/${todolistID}/tasks/${taskID}`,
      model,
    ),
};
