import { useSelector } from "react-redux";
import { RootStateType, useAppDispatch } from "../../../../app/store";
import { useCallback } from "react";
import { createTaskTC } from "../../tasks-reducer";
import { FilterValuesType, TodolistDomainType } from "../../todolists-reducer";
import { TaskStatuses, TaskType } from "../../../../api/tasksAPI";

export const useTodolist = (
  // todolistId: string,
  // filter: FilterValuesType,
  todolist: TodolistDomainType,
  onChangeFilter: (value: FilterValuesType, todolistId: string) => void,
  onRemoveTodolist: (todolistId: string) => void,
  onChangeTodolistTitle: (newTitle: string, todolistId: string) => void,
) => {
  let tasks = useSelector<RootStateType, TaskType[]>(
    (state) => state.tasks[todolist.id],
  );

  if (todolist.filter === "completed") {
    tasks = tasks.filter((item) => item.status === TaskStatuses.Completed);
  } else if (todolist.filter === "active") {
    tasks = tasks.filter((item) => item.status === TaskStatuses.New);
  }

  const dispatch = useAppDispatch();

  const onTsarClickHandler = useCallback(
    (filter: FilterValuesType) => onChangeFilter(filter, todolist.id),
    [onChangeFilter, todolist.id],
  );

  const removeTodolistHandler = () => onRemoveTodolist(todolist.id);

  const addTask = useCallback(
    (title: string) => dispatch(createTaskTC(todolist.id, title)),
    [dispatch, todolist.id], //dispatch(addTaskAC(todolistId, title)),
  );

  const changeTodolistTitleHandler = useCallback(
    (newTitle: string) => onChangeTodolistTitle(newTitle, todolist.id),
    [onChangeTodolistTitle, todolist.id],
  );

  return {
    tasks,
    onTsarClickHandler,
    removeTodolistHandler,
    addTask,
    changeTodolistTitleHandler,
    dispatch,
  };
};