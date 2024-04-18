import React, { FC, memo } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import { Delete } from "@material-ui/icons";
import { useTask } from "./hooks/useTask";
import { TaskStatuses, TaskType } from "../../../../api/tasksAPI";

type TaskProps = {
  task: TaskType;
  todolistId: string;

  disabled?: boolean;
};

export const Task: FC<TaskProps> = memo(
  ({ task, todolistId, disabled = false }) => {
    const {
      onChangeStatusHandler,
      onChangeTitleHandler,
      onDeleteHandler,
      disableCondition,
    } = useTask(task, todolistId, disabled);

    return (
      <li
        className={task.status === TaskStatuses.Completed ? "is-done" : ""}
        key={task.id}
      >
        <Checkbox
          checked={task.status === TaskStatuses.Completed}
          onChange={onChangeStatusHandler}
          disabled={disableCondition}
        />
        <EditableSpan
          disabled={disableCondition}
          originTitle={task.title}
          onChange={onChangeTitleHandler}
        />
        <IconButton disabled={disableCondition} onClick={onDeleteHandler}>
          <Delete />
        </IconButton>
      </li>
    );
  },
);
