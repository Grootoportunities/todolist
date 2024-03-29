import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "../../../state/store";
import { TaskType } from "../Todolist";
import { useCallback } from "react";
import { FilterValuesType } from "../../../AppWithRedux/AppWithRedux";
import { addTaskAC } from "../../../state/tasks-reducer";

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
    tasks = tasks.filter((item) => item.checked);
  } else if (filter === "active") {
    tasks = tasks.filter((item) => !item.checked);
  }

  const dispatch = useDispatch();

  const onTsarClickHandler = useCallback(
    (filter: FilterValuesType) => onChangeFilter(filter, todolistId),
    [onChangeFilter, todolistId],
  );

  const removeTodolistHandler = () => onRemoveTodolist(todolistId);

  const addTask = useCallback(
    (title: string) => dispatch(addTaskAC(todolistId, title)),
    [dispatch, todolistId],
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
