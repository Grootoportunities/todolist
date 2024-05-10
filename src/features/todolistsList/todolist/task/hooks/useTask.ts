import { ChangeEvent, useCallback, useMemo } from "react";
import { deleteTaskTC, updateTaskTC } from "../../../tasks-reducer";
import { TaskStatuses, TaskType } from "../../../../../api/tasksAPI";
import { StatusesType } from "../../../../../app/app-reducer";
import { useAppDispatch } from "../../../../../app/hooks/hooks";

export const useTask = (
    task: TaskType,
    todolistID: string,
    disabled: boolean,
) => {
  const dispatch = useAppDispatch();

  const onChangeStatusHandler = useCallback(
      (e: ChangeEvent<HTMLInputElement>) =>
          dispatch(
              updateTaskTC(todolistID, task.id, {
                status: e.currentTarget.checked
                    ? TaskStatuses.Completed
                    : TaskStatuses.New,
              }),
          ),
      [todolistID, task.id],
  );

  const onChangeTitleHandler = useCallback(
      (newTitle: string) =>
          dispatch(updateTaskTC(todolistID, task.id, { title: newTitle })),
      [todolistID, task.id],
  );

  const onDeleteHandler = useCallback(
      () => dispatch(deleteTaskTC({ todolistID, taskID: task.id })),
      [todolistID, task.id],
  );

  const disableCondition = useMemo(
      () => disabled || task.entityStatus === StatusesType.LOADING,
      [disabled, task.entityStatus],
  );

  return {
    onChangeStatusHandler,
    onChangeTitleHandler,
    onDeleteHandler,
    disableCondition,
  };
};
