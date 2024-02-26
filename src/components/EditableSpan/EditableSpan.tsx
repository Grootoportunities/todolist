import React, { FC, memo } from "react";
import { TextField } from "@material-ui/core";
import { useEditableSpan } from "./hooks/useEditableSpan";

type EditableSpanProps = {
  originTitle: string;
  onChange: (newValue: string) => void;
};

export const EditableSpan: FC<EditableSpanProps> = memo(
  ({ originTitle, onChange }) => {
    const {
      editMode,
      title,
      spanDoubleClickHandler,
      inputBlurHandler,
      onChangeSpanHandler,
    } = useEditableSpan(originTitle, onChange);

    return editMode ? (
      <TextField
        onBlur={inputBlurHandler}
        value={title}
        onChange={onChangeSpanHandler}
        autoFocus
        variant={"outlined"}
      />
    ) : (
      <span onDoubleClick={spanDoubleClickHandler}>{originTitle}</span>
    );
  },
);
