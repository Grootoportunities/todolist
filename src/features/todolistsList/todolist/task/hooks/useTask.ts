import { ChangeEvent, useCallback, useMemo } from "react";
import { TaskStatuses, TaskType } from "../../../../../api/tasksAPI";
import { StatusesType } from "../../../../../app/app-reducer";
import { useActions } from "../../../../../app/hooks/useActions";

export const useTask = (
  task: TaskType,
  todolistID: string,
  disabled: boolean,
) => {
  const { updateTask, deleteTask } = useActions();

  const onChangeStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateTask({
        todolistID,
        taskID: task.id,
        model: {
          status: e.currentTarget.checked
            ? TaskStatuses.Completed
            : TaskStatuses.New,
        },
      }),
    [todolistID, task.id],
  );

  const onChangeTitleHandler = useCallback(
    (newTitle: string) =>
      updateTask({
        todolistID,
        taskID: task.id,
        model: { title: newTitle },
      }),
    [todolistID, task.id],
  );

  const onDeleteHandler = useCallback(
    () => deleteTask({ todolistID, taskID: task.id }),
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
