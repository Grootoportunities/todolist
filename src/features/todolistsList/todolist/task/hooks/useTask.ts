import { ChangeEvent, useCallback } from "react";
import { deleteTaskTC, updateTaskTC } from "../../../tasks-reducer";
import { TaskStatuses, TaskType } from "../../../../../api/tasksAPI";
import { useAppDispatch } from "../../../../../app/store";

export const useTask = (task: TaskType, todolistId: string) => {
  const dispatch = useAppDispatch();

  const onChangeStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(
        updateTaskTC(todolistId, task.id, {
          status: e.currentTarget.checked
            ? TaskStatuses.Completed
            : TaskStatuses.New,
        }),
      ),
    [todolistId, task.id],
  );

  const onChangeTitleHandler = useCallback(
    (newTitle: string) =>
      dispatch(updateTaskTC(todolistId, task.id, { title: newTitle })),
    [todolistId, task.id],
  );

  const onDeleteHandler = useCallback(
    () => dispatch(deleteTaskTC(todolistId, task.id)),
    [todolistId, task.id],
  );

  return { onChangeStatusHandler, onChangeTitleHandler, onDeleteHandler };
};
