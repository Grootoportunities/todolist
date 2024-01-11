import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { Button, Icon, IconButton, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";

type AddItemFormProps = {
  addItem: (ItemName: string) => void;
};

export function AddItemForm(props: AddItemFormProps) {
  const [newTaskName, setNewTaskName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onChangeNewTaskNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskName(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.charCode === 13) {
      props.addItem(newTaskName);
      setNewTaskName("");
    }
  };

  const addTask = () => {
    if (newTaskName.trim() !== "") {
      props.addItem(newTaskName.trim());
      setNewTaskName("");
    } else setError("Field is required");
  };
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
}
