import { useCallback, useEffect } from "react";
import { useActions, useAppSelector } from "../../../common/hooks";
import { AddItemHelpers } from "../../../common/components";
import {selectTodolist} from "../ui/todolist/model/todolists.selectors";
import {todolistsThunks} from "../ui/todolist/model/todolistsSlice";

export const useTodolistsList = (demo: boolean) => {
  const todolists = useAppSelector(selectTodolist);
  const { fetchTodolists, createTodolist } = useActions();

  const addTodolist = useCallback(
    async (title: string, helpers: AddItemHelpers) => {
      const res = await createTodolist(title);

      if (todolistsThunks.createTodolist.rejected.match(res)) {
        const errorMessage = res.payload?.errors.length
          ? res.payload.errors[0]
          : "Some error occurred.";

        helpers.setError(errorMessage);

        return;
      }

      helpers.setItemTitle("");
    },
    [],
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
