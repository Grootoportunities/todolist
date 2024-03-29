import { useDispatch } from "react-redux";
import { ChangeEvent, useCallback } from "react";
import {
  changeTaskIsDoneAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "../../../state/tasks-reducer";
import { TaskType } from "../../Todolist/Todolist";

export const useTask = (task: TaskType, todolistId: string) => {
  const dispatch = useDispatch();

  const onChangeStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(
        changeTaskIsDoneAC(todolistId, task.id, e.currentTarget.checked),
      ),
    [todolistId, task.id],
  );

  const onChangeTitleHandler = useCallback(
    (newTitle: string) =>
      dispatch(changeTaskTitleAC(todolistId, task.id, newTitle)),
    [todolistId, task.id],
  );

  const onDeleteHandler = useCallback(
    () => dispatch(removeTaskAC(todolistId, task.id)),
    [todolistId, task.id],
  );

  return { onChangeStatusHandler, onChangeTitleHandler, onDeleteHandler };
};
