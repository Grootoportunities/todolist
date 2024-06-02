import React, { FC, memo } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useAddItemForm } from "./lib/useAddItemForm";
import { AddItemFormProps } from "./types";
import { S } from "./_styles";

export const AddItemForm: FC<AddItemFormProps> = memo(
  ({ addItem, disabled = false }) => {
    const {
      newTaskName,
      error,
      onChangeNewTaskNameHandler,
      onKeyPressHandler,
      addItemHandler,
    } = useAddItemForm(addItem);

    return (
      <S.Container>
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
        <IconButton
          onClick={addItemHandler}
          color={"secondary"}
          disabled={disabled}
        >
          <Add />
        </IconButton>
      </S.Container>
    );
  },
);
