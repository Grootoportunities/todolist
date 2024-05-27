import { useCallback, useEffect } from "react";
import { useAppSelector } from "../../../app/hooks/hooks";
import { useActions } from "../../../app/hooks/useActions";
import { selectTodolist } from "../todolists.selectors";

export const useTodolistsList = (demo: boolean) => {
  const todolists = useAppSelector(selectTodolist);
  const { createTodolist, fetchTodolists } = useActions();

  const addTodolist = useCallback((title: string) => createTodolist(title), []);

  useEffect(() => {
    if (demo) return;

    fetchTodolists();
  }, []);

  return {
    todolists,
    addTodolist,
  };
};
