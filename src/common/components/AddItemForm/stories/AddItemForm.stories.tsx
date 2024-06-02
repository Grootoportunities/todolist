import { AddItemForm } from "../AddItemForm";
import { action } from "@storybook/addon-actions";

export default {
  title: "AddItemForm",
  component: AddItemForm,
};

const actionCallback = async () =>
  action("Button add has been pushed with values");

export const AddItemFormExample = () => (
  <AddItemForm addItem={actionCallback} />
);

export const AddItemFormDisabled = () => (
  <AddItemForm addItem={actionCallback} disabled />
);
