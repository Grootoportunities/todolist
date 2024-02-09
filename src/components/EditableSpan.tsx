import React, { ChangeEvent, useState } from "react";
import { TextField } from "@material-ui/core";

type EditableSpanProps = {
  title: string;
  onChange: (newValue: string) => void;
};

export const EditableSpan = React.memo((props: EditableSpanProps) => {
  console.log("Editable Span has been called");

  let [editMode, setEditMode] = useState(false);
  let [title, setTitle] = useState("");
  const spanDoubleClickHandler = () => {
    setEditMode(true);
    setTitle(props.title);
  };
  const inputBlurHandler = () => {
    setEditMode(false);
    props.onChange(title);
  };

  const onChangeSpanHandler = (event: ChangeEvent<HTMLInputElement>) =>
    setTitle(event.currentTarget.value);

  return editMode ? (
    <TextField
      onBlur={inputBlurHandler}
      value={title}
      onChange={onChangeSpanHandler}
      autoFocus
      variant={"outlined"}
    />
  ) : (
    <span onDoubleClick={spanDoubleClickHandler}>{props.title}</span>
  );
});
