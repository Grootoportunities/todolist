import React, { FC, memo } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "common/components";
import { Delete } from "@material-ui/icons";
import { useTask } from "../../../lib";
import { TaskStatuses } from "common/enums";
import { S } from "./_styles";
import { TaskType } from "../../../api";

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
      <S.TaskItem
        key={task.id}
        isDone={task.status}
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
      </S.TaskItem>
    );
  },
);
