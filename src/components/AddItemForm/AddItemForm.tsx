import React, { FC, memo } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useAddItemForm } from "./hooks/useAddItemForm";
import styled from "styled-components";

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
      <Container>
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
      </Container>
    );
  },
);

export type AddItemHelpers = {
  setError: (error: string) => void;
  setItemTitle: (title: string) => void;
};

type AddItemFormProps = {
  addItem: (itemName: string, helpers: AddItemHelpers) => Promise<any>;
  disabled?: boolean;
};

const Container = styled.div`
  display: flex;
  gap: 5px;
`;
