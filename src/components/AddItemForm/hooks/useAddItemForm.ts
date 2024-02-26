import { ChangeEvent, KeyboardEvent, useState } from "react";

export const useAddItemForm = (onItemAdded: (itemName: string) => void) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onChangeNewTaskNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskName(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) setError(null);
    if (e.charCode === 13) {
      onItemAdded(newTaskName);
      setNewTaskName("");
    }
  };

  const addTask = () => {
    if (newTaskName.trim() !== "") {
      onItemAdded(newTaskName.trim());
      setNewTaskName("");
    } else setError("Field is required");
  };

  return {
    newTaskName,
    error,
    onChangeNewTaskNameHandler,
    onKeyPressHandler,
    addTask,
  };
};
