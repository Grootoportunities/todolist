import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "./EditableSpan";
import { Delete } from "@material-ui/icons";
import {
  changeTaskIsDoneAC,
  changeTaskTitleAC,
  removeTaskAC,
} from "../state/tasks-reducer";
import { useDispatch } from "react-redux";
import { TaskType } from "./Todolist";

type TaskProps = {
  task: TaskType;
  todolistId: string;
};

export const Task: React.FC<TaskProps> = React.memo(({ task, todolistId }) => {
  const dispatch = useDispatch();

  const onChangeStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      dispatch(
        changeTaskIsDoneAC(todolistId, task.id, e.currentTarget.checked),
      ),
    [todolistId, task.id],
  );

  const onChangeTitleHandler = useCallback(
    (newTitle: string) =>
      dispatch(changeTaskTitleAC(todolistId, task.id, newTitle)),
    [todolistId, task.id],
  );

  const onDeleteHandler = useCallback(
    () => dispatch(removeTaskAC(todolistId, task.id)),
    [todolistId, task.id],
  );

  return (
    <li className={task.checked ? "is-done" : ""} key={task.id}>
      <Checkbox checked={task.checked} onChange={onChangeStatusHandler} />
      <EditableSpan title={task.name} onChange={onChangeTitleHandler} />
      <IconButton onClick={onDeleteHandler}>
        <Delete />
      </IconButton>
    </li>
  );
});
