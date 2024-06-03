import { useCallback, useEffect } from "react";
import { FilterValuesType, TodolistDomainType } from "../model/todolistsSlice";
import { selectTasks, tasksThunks, TaskType } from "../ui/task";
import { PropTypes } from "@material-ui/core";
import { v1 } from "uuid";
import { useActions, useAppSelector } from "../../../../../common/hooks";
import { AddItemHelpers } from "../../../../../common/components";
import { TaskStatuses } from "../../../../../common/enums";

export const useTodolist = (demo: boolean, todolist: TodolistDomainType) => {
  const { id: todolistID, filter } = todolist;
  const tasks = useAppSelector(selectTasks(todolistID));
  let filteredTasks: TaskType[] = tasks;
  const {
    fetchTasks,
    changeTodolistFilter,
    deleteTodolist,
    updateTodolistTitle,
    createTask,
  } = useActions();

  const filterButtons: FilterButtons[] = [
    { ID: v1(), filter: "all", text: "All" },
    { ID: v1(), filter: "active", color: "secondary", text: "Active" },
    { ID: v1(), filter: "completed", color: "primary", text: "completed" },
  ];

  if (filter === "completed") {
    filteredTasks = tasks.filter(
      (item) => item.status === TaskStatuses.Completed,
    );
  } else if (filter === "active") {
    filteredTasks = tasks.filter((item) => item.status === TaskStatuses.New);
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
      const res = await createTask({ todolistID, title });

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
    filteredTasks,
  };
};

type FilterButtons = {
  ID: string;
  text: string;
  filter: FilterValuesType;
  color?: PropTypes.Color;
};
