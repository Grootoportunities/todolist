import React, { ChangeEvent, useState } from "react";

type EditableSpanProps = {
  title: string;
  onChange: (newValue: string) => void;
};

export function EditableSpan(props: EditableSpanProps) {
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
    <input
      onBlur={inputBlurHandler}
      value={title}
      onChange={onChangeSpanHandler}
      autoFocus
    />
  ) : (
    <span onDoubleClick={spanDoubleClickHandler}>{props.title}</span>
  );
}
