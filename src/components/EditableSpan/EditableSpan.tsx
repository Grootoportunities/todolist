import React, { FC, memo } from "react";
import { TextField } from "@material-ui/core";
import { useEditableSpan } from "./hooks/useEditableSpan";

type EditableSpanProps = {
  originTitle: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
};

export const EditableSpan: FC<EditableSpanProps> = memo(
  ({ originTitle, onChange, disabled = false }) => {
    const {
      editMode,
      title,
      spanDoubleClickHandler,
      inputBlurHandler,
      onChangeSpanHandler,
    } = useEditableSpan(originTitle, onChange, disabled);

    return editMode ? (
      <TextField
        onBlur={inputBlurHandler}
        value={title}
        onChange={onChangeSpanHandler}
        autoFocus
        variant={"outlined"}
        disabled={disabled}
      />
    ) : (
      <span onDoubleClick={spanDoubleClickHandler}>{originTitle}</span>
    );
  },
);
