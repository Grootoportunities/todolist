import React, { FC, memo } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "../EditableSpan/EditableSpan";
import { Delete } from "@material-ui/icons";
import { useTask } from "./hooks/useTask";
import { TaskStatuses, TaskType } from "../../api/tasksAPI";

type TaskProps = {
  task: TaskType;
  todolistId: string;
};

export const Task: FC<TaskProps> = memo(({ task, todolistId }) => {
  const { onChangeStatusHandler, onChangeTitleHandler, onDeleteHandler } =
    useTask(task, todolistId);

  return (
    <li
      className={task.status === TaskStatuses.Completed ? "is-done" : ""}
      key={task.id}
    >
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        onChange={onChangeStatusHandler}
      />
      <EditableSpan originTitle={task.title} onChange={onChangeTitleHandler} />
      <IconButton onClick={onDeleteHandler}>
        <Delete />
      </IconButton>
    </li>
  );
});
