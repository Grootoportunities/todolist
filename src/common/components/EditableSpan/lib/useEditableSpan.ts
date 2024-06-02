import { ChangeEvent, useState } from "react";

export const useEditableSpan = (
  originTitle: string,
  onSpanChange: (newValue: string) => void,
  disabled: boolean,
) => {
  let [editMode, setEditMode] = useState(false);
  let [title, setTitle] = useState("");
  const spanDoubleClickHandler = () => {
    if (disabled) return;

    setEditMode(true);
    setTitle(originTitle);
  };
  const inputBlurHandler = () => {
    setEditMode(false);
    onSpanChange(title);
  };

  const onChangeSpanHandler = (event: ChangeEvent<HTMLInputElement>) =>
    setTitle(event.currentTarget.value);

  return {
    editMode,
    title,
    spanDoubleClickHandler,
    inputBlurHandler,
    onChangeSpanHandler,
  };
};
