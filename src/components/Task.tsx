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

type TaskProps = {
  checked: boolean;
  taskID: string;
  name: string;
  todolistId: string;
};

export const Task: React.FC<TaskProps> = React.memo(
  ({ checked, taskID, name, todolistId }) => {
    const dispatch = useDispatch();

    const onChangeStatusHandler = useCallback(
      (e: ChangeEvent<HTMLInputElement>) =>
        dispatch(
          changeTaskIsDoneAC(todolistId, taskID, e.currentTarget.checked),
        ),
      [todolistId, taskID],
    );

    const onChangeTitleHandler = useCallback(
      (newTitle: string) =>
        dispatch(changeTaskTitleAC(todolistId, taskID, newTitle)),
      [todolistId, taskID],
    );

    const onDeleteHandler = useCallback(
      () => dispatch(removeTaskAC(todolistId, taskID)),
      [todolistId, taskID],
    );

    return (
      <li className={checked ? "is-done" : ""} key={taskID}>
        <Checkbox checked={checked} onChange={onChangeStatusHandler} />
        <EditableSpan title={name} onChange={onChangeTitleHandler} />
        <IconButton onClick={onDeleteHandler}>
          <Delete />
        </IconButton>
      </li>
    );
  },
);
