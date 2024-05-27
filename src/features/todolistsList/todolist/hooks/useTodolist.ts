import { useCallback, useEffect } from "react";
import { FilterValuesType, TodolistDomainType } from "../../todolists-reducer";
import { TaskStatuses } from "../../../../api/tasksAPI";
import { useAppSelector } from "../../../../app/hooks/hooks";
import { useActions } from "../../../../app/hooks/useActions";
import { selectTasks } from "../../tasks.selectors";

export const useTodolist = (demo: boolean, todolist: TodolistDomainType) => {
  const { id: todolistID, filter } = todolist;
  let tasks = useAppSelector(selectTasks(todolistID));
  const {
    createTask,
    fetchTasks,
    changeTodolistFilter,
    deleteTodolist,
    updateTodolistTitle,
  } = useActions();

  if (filter === "completed") {
    tasks = tasks.filter((item) => item.status === TaskStatuses.Completed);
  } else if (filter === "active") {
    tasks = tasks.filter((item) => item.status === TaskStatuses.New);
  }

  const onTsarClickHandler = useCallback(
    (filter: FilterValuesType) => changeTodolistFilter({ filter, todolistID }),
    [todolistID],
  );

  const removeTodolistHandler = useCallback(
    () => deleteTodolist(todolistID),
    [todolistID],
  );

  const addTask = useCallback(
    (title: string) => createTask({ todolistID, title }),
    [todolistID],
  );

  const changeTodolistTitleHandler = useCallback(
    (title: string) => updateTodolistTitle({ title, todolistID }),
    [todolistID],
  );

  useEffect(() => {
    if (demo) return;

    fetchTasks(todolistID);
  }, []);

  return {
    tasks,
    onTsarClickHandler,
    removeTodolistHandler,
    addTask,
    changeTodolistTitleHandler,
  };
};
