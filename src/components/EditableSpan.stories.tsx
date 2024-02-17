import { EditableSpan } from "./EditableSpan";
import { action } from "@storybook/addon-actions";

export default {
  title: "Editable Span",
  component: EditableSpan,
};

const actionCallback = action("Editable span wants to change");

export const EditableSpanExample = () => (
  <EditableSpan title={"Editable Span"} onChange={actionCallback} />
);
