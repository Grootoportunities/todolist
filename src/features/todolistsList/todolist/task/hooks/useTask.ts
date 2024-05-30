import { ChangeEvent, useCallback, useMemo } from "react";
import { TaskStatuses, TaskType } from "../../../../../api/tasksAPI";
import { StatusesType } from "../../../../application";
import { useActions } from "../../../../../app/hooks/hooks";

export const useTask = (
  task: TaskType,
  todolistID: string,
  disabled: boolean,
) => {
  const { updateTask, deleteTask } = useActions();
  const { id: taskID, entityStatus } = task;

  const onChangeStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateTask({
        todolistID,
        taskID,
        model: {
          status: e.currentTarget.checked
            ? TaskStatuses.Completed
            : TaskStatuses.New,
        },
      }),
    [todolistID, taskID],
  );

  const onChangeTitleHandler = useCallback(
    (title: string) =>
      updateTask({
        todolistID,
        taskID,
        model: { title },
      }),
    [todolistID, taskID],
  );

  const onDeleteHandler = useCallback(
    () => deleteTask({ todolistID, taskID }),
    [todolistID, taskID],
  );

  const disableCondition = useMemo(
    () => disabled || entityStatus === StatusesType.LOADING,
    [disabled, entityStatus],
  );

  return {
    onChangeStatusHandler,
    onChangeTitleHandler,
    onDeleteHandler,
    disableCondition,
  };
};
