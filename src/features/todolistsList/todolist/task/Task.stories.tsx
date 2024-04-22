import { Task } from "./Task";
import { ReduxStoreProviderDecorator } from "../../../../stories/ReduxStoreProviderDecorator";
import { useAppSelector } from "../../../../app/hooks";

export default {
  title: "Task",
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
};

const TaskExample = () => {
  let tasks = useAppSelector((state) => state.tasks["todolistId1"]);

  const mappedTasks = tasks.map((t) => (
    <Task todolistId={"todolistId1"} task={t} />
  ));

  return <>{mappedTasks}</>;
};

export const TaskStory = {
  render: () => <TaskExample />,
};
