import { useCallback, useEffect } from "react";
import {
  useActions,
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/hooks";
import { selectTodolist } from "../todolists.selectors";
import { todolistsThunks } from "../todolists-reducer";
import { AddItemHelpers } from "../../../components/AddItemForm/AddItemForm";

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
