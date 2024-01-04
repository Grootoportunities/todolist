import React, { ChangeEvent, KeyboardEvent, useState } from "react";

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
      <input
        value={newTaskName}
        onChange={onChangeNewTaskNameHandler}
        onKeyPress={onKeyPressHandler}
        className={error ? "error" : ""}
      />
      <button onClick={addTask}>+</button>
      <div className="error-message">{error}</div>
    </div>
  );
}
