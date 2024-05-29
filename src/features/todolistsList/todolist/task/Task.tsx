import React, { FC, memo } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import { Delete } from "@material-ui/icons";
import { useTask } from "./hooks/useTask";
import { TaskStatuses, TaskType } from "../../../../api/tasksAPI";
import styled from "styled-components";

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
      <TaskItem
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
      </TaskItem>
    );
  },
);

const TaskItem = styled.li`
  position: relative;
  padding-left: 10px; /* Отступ для пользовательского маркера */
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-break: break-all;

  &::before {
    content: "•"; /* Символ маркера */
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%); /* Центрирование маркера по вертикали */
    color: black; /* Цвет маркера */
    font-size: 1.5em; /* Размер маркера */
  }
`;
