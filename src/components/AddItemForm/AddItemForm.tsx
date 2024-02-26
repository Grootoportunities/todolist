import React, { FC, memo } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useAddItemForm } from "./hooks/useAddItemForm";

type AddItemFormProps = {
  addItem: (itemName: string) => void;
};

export const AddItemForm: FC<AddItemFormProps> = memo(({ addItem }) => {
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
        onKeyPress={onKeyPressHandler}
        error={!!error}
        helperText={error}
      />
      <IconButton onClick={addTask} color={"secondary"}>
        <Add />
      </IconButton>
    </div>
  );
});
