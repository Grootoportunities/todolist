import React, { FC, memo } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "../EditableSpan/EditableSpan";
import { Delete } from "@material-ui/icons";
import { TaskType } from "../Todolist/Todolist";
import { useTask } from "./hooks/useTask";

type TaskProps = {
  task: TaskType;
  todolistId: string;
};

export const Task: FC<TaskProps> = memo(({ task, todolistId }) => {
  const { onChangeStatusHandler, onChangeTitleHandler, onDeleteHandler } =
    useTask(task, todolistId);

  return (
    <li className={task.checked ? "is-done" : ""} key={task.id}>
      <Checkbox checked={task.checked} onChange={onChangeStatusHandler} />
      <EditableSpan originTitle={task.name} onChange={onChangeTitleHandler} />
      <IconButton onClick={onDeleteHandler}>
        <Delete />
      </IconButton>
    </li>
  );
});
