import { ChangeEvent, KeyboardEvent, useState } from "react";

import { AddItemHelpers } from "../types";

export const useAddItemForm = (
  onItemAdded: (itemName: string, helpers: AddItemHelpers) => Promise<any>,
) => {
  const [itemTitle, setItemTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onChangeNewTaskNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setItemTitle(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) setError(null);

    if (e.charCode === 13) {
      onItemAdded(itemTitle, { setError, setItemTitle });
    }
  };

  const addItemHandler = async () => {
    if (itemTitle.trim() !== "")
      onItemAdded(itemTitle.trim(), { setError, setItemTitle });
    else setError("Field is required");
  };

  return {
    newTaskName: itemTitle,
    error,
    onChangeNewTaskNameHandler,
    onKeyPressHandler,
    addItemHandler,
  };
};
