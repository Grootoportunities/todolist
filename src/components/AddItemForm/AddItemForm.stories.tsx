import { AddItemForm } from "./AddItemForm";
import { action } from "@storybook/addon-actions";

export default {
  title: "AddItemForm",
  component: AddItemForm,
};

const actionCallback = action("Button add has been pushed with values");

export const AddItemFormExample = () => (
  <AddItemForm addItem={actionCallback} />
);
