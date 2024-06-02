import { useCallback, useEffect } from "react";
import { selectTodolist } from "../ui/todolist";
import { todolistsThunks } from "../ui/todolist";
import { useAppDispatch } from "../../../common/hooks";
import { useAppSelector } from "../../../common/hooks";
import { useActions } from "../../../common/hooks";
import { AddItemHelpers } from "../../../common/components";

export const useTodolistsList = (demo: boolean) => {
  const todolists = useAppSelector(selectTodolist);
  const { fetchTodolists } = useActions();

  const dispatch = useAppDispatch();

  const addTodolist = useCallback(
    async (title: string, helpers: AddItemHelpers) => {
      const res = await dispatch(todolistsThunks.createTodolist(title));

      if (todolistsThunks.createTodolist.rejected.match(res)) {
        const errorMessage = res.payload?.errors.length
          ? res.payload.errors[0]
          : "Some error occurred.";

        helpers.setError(errorMessage);

        return;
      }

      helpers.setItemTitle("");
    },
    [dispatch],
  );

  useEffect(() => {
    if (demo) return;

    fetchTodolists();
  }, []);

  return {
    todolists,
    addTodolist,
  };
};
