import { useSelector } from "react-redux";
import { RootStateType, useAppDispatch } from "../../../state/store";
import { useCallback } from "react";
import { createTaskTC } from "../../../state/tasks-reducer";
import { FilterValuesType } from "../../../state/todolists-reducer";
import { TaskStatuses, TaskType } from "../../../api/tasksAPI";

export const useTodolist = (
  todolistId: string,
  filter: FilterValuesType,
  onChangeFilter: (value: FilterValuesType, todolistId: string) => void,
  onRemoveTodolist: (todolistId: string) => void,
  onChangeTodolistTitle: (newTitle: string, todolistId: string) => void,
) => {
  let tasks = useSelector<RootStateType, TaskType[]>(
    (state) => state.tasks[todolistId],
  );

  if (filter === "completed") {
    tasks = tasks.filter((item) => item.status === TaskStatuses.Completed);
  } else if (filter === "active") {
    tasks = tasks.filter((item) => item.status === TaskStatuses.New);
  }

  const dispatch = useAppDispatch();

  const onTsarClickHandler = useCallback(
    (filter: FilterValuesType) => onChangeFilter(filter, todolistId),
    [onChangeFilter, todolistId],
  );

  const removeTodolistHandler = () => onRemoveTodolist(todolistId);

  const addTask = useCallback(
    (title: string) => dispatch(createTaskTC(todolistId, title)),
    [dispatch, todolistId], //dispatch(addTaskAC(todolistId, title)),
  );

  const changeTodolistTitleHandler = useCallback(
    (newTitle: string) => onChangeTodolistTitle(newTitle, todolistId),
    [onChangeTodolistTitle, todolistId],
  );

  return {
    tasks,
    onTsarClickHandler,
    removeTodolistHandler,
    addTask,
    changeTodolistTitleHandler,
  };
};
