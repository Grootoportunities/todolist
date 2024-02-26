import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "../../state/store";
import { FilterValuesType, TodolistType } from "../AppWithRedux";
import { useCallback } from "react";
import {
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
} from "../../state/todolists-reducer";

export const useAppWithRedux = () => {
  const dispatch = useDispatch();

  const todolists = useSelector<RootStateType, TodolistType[]>(
    (state) => state.todolists,
  );

  const changeFilter = useCallback(
    (value: FilterValuesType, todolistId: string) =>
      dispatch(changeTodolistFilterAC(todolistId, value)),
    [dispatch],
  );

  const removeTodolist = useCallback(
    (todolistId: string) => dispatch(removeTodolistAC(todolistId)),
    [dispatch],
  );

  const onChangeTodolistTitle = useCallback(
    (newTitle: string, todolistId: string) =>
      dispatch(changeTodolistTitleAC(todolistId, newTitle)),
    [dispatch],
  );

  const addTodolist = useCallback(
    (title: string) => dispatch(addTodolistAC(title)),
    [dispatch],
  );

  return {
    todolists,
    changeFilter,
    removeTodolist,
    onChangeTodolistTitle,
    addTodolist,
  };
};
