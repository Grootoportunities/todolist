import { useCallback } from "react";
import {
  changeTodolistFilter,
  createTodolistTC,
  deleteTodolistTC,
  FilterValuesType,
  updateTodolistTitleTC,
} from "../todolists-reducer";
import { useAppDispatch, useAppSelector } from "../../../app/hooks/hooks";

export const useTodolistsList = () => {
  const dispatch = useAppDispatch();

  const todolists = useAppSelector((state) => state.todolists);

  const changeFilter = useCallback(
    (value: FilterValuesType, todolistId: string) =>
      dispatch(
        changeTodolistFilter({ todolistID: todolistId, newFilter: value }),
      ),
    [dispatch],
  );

  const removeTodolist = useCallback(
    (todolistId: string) => dispatch(deleteTodolistTC(todolistId)),
    [dispatch],
  );

  const onChangeTodolistTitle = useCallback(
    (newTitle: string, todolistID: string) =>
      dispatch(updateTodolistTitleTC({ todolistID, title: newTitle })),
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
