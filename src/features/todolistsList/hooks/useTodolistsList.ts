import { useCallback } from "react";
import {
  changeTodolistFilterAC,
  createTodolistTC,
  deleteTodolistTC,
  FilterValuesType,
  updateTodolistTitleTC,
} from "../todolists-reducer";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

export const useTodolistsList = () => {
  const dispatch = useAppDispatch();

  const todolists = useAppSelector((state) => state.todolists);

  const changeFilter = useCallback(
    (value: FilterValuesType, todolistId: string) =>
      dispatch(changeTodolistFilterAC(todolistId, value)),
    [dispatch],
  );

  const removeTodolist = useCallback(
    (todolistId: string) => dispatch(deleteTodolistTC(todolistId)),
    [dispatch],
  );

  const onChangeTodolistTitle = useCallback(
    (newTitle: string, todolistId: string) =>
      dispatch(updateTodolistTitleTC(todolistId, newTitle)),
    [dispatch],
  );

  const addTodolist = useCallback(
    (title: string) => dispatch(createTodolistTC(title)),
    [dispatch],
  );

  return {
    todolists,
    changeFilter,
    removeTodolist,
    onChangeTodolistTitle,
    addTodolist,
    dispatch,
  };
};
