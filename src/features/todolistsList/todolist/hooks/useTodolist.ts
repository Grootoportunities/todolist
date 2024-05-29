import { useCallback, useEffect } from "react";
import { FilterValuesType, TodolistDomainType } from "../../todolists-reducer";
import { TaskStatuses } from "../../../../api/tasksAPI";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks/hooks";
import { useActions } from "../../../../app/hooks/useActions";
import { selectTasks } from "../../tasks.selectors";
import { PropTypes } from "@material-ui/core";
import { v1 } from "uuid";
import { tasksThunks } from "../../tasks-reducer";
import { AddItemHelpers } from "../../../../components/AddItemForm/AddItemForm";

export const useTodolist = (demo: boolean, todolist: TodolistDomainType) => {
  const { id: todolistID, filter } = todolist;
  let tasks = useAppSelector(selectTasks(todolistID));
  const {
    fetchTasks,
    changeTodolistFilter,
    deleteTodolist,
    updateTodolistTitle,
  } = useActions();

  const dispatch = useAppDispatch();

  const filterButtons: FilterButtons[] = [
    { ID: v1(), filter: "all", text: "All" },
    { ID: v1(), filter: "active", color: "secondary", text: "Active" },
    { ID: v1(), filter: "completed", color: "primary", text: "completed" },
  ];

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
    async (title: string, helpers: AddItemHelpers) => {
      const res = await dispatch(tasksThunks.createTask({ todolistID, title }));

      if (tasksThunks.createTask.rejected.match(res)) {
        const errorMessage = res.payload?.errors.length
          ? res.payload.errors[0]
          : "Some error occurred.";

        helpers.setError(errorMessage);

        return;
      }

      helpers.setItemTitle("");
    },
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
    filterButtons,
  };
};

type FilterButtons = {
  ID: string;
  text: string;
  filter: FilterValuesType;
  color?: PropTypes.Color;
};
