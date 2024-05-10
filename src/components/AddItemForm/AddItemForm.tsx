import React, { FC, memo } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useAddItemForm } from "./hooks/useAddItemForm";

type AddItemFormProps = {
  addItem: (itemName: string) => void;
  disabled?: boolean;
};

export const AddItemForm: FC<AddItemFormProps> = memo(
  ({ addItem, disabled = false }) => {
    const {
      newTaskName,
      error,
      onChangeNewTaskNameHandler,
      onKeyPressHandler,
      addTask,
    } = useAddItemForm(addItem);

    return (
      <div>
        <TextField
          label={"Type value"}
          variant={"standard"}
          value={newTaskName}
          onChange={onChangeNewTaskNameHandler}
          onKeyDown={onKeyPressHandler}
          error={!!error}
          helperText={error}
          disabled={disabled}
        />
        <IconButton onClick={addTask} color={"secondary"} disabled={disabled}>
          <Add />
        </IconButton>
      </div>
    );
  },
);
