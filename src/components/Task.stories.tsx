import { Task } from "./Task";
import { TaskType } from "./Todolist";
import { ReduxStoreProviderDecorator } from "../stories/ReduxStoreProviderDecorator";

export default {
  title: "Task",
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
};

const unCheckedTask: TaskType = {
  id: "1",
  checked: false,
  name: "Unchecked task",
};
const checkedTask: TaskType = { id: "1", checked: true, name: "Checked task" };

export const TaskExample = () => (
  <>
    <Task todolistId={"1"} task={checkedTask} />
    <Task todolistId={"1"} task={unCheckedTask} />
  </>
);
