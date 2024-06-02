import { Task } from "../ui/Task";
import { ReduxStoreProviderDecorator } from "../../../../../../../stories/ReduxStoreProviderDecorator";
import { useAppSelector } from "../../../../../../../common/hooks";
import { selectTasks } from "../model/tasks.selectors";

export default {
  title: "Task",
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
};

const TaskExample = () => {
  const tasks = useAppSelector(selectTasks("todolistId1"));

  const mappedTasks = tasks.map((t) => (
    <Task todolistId={"todolistId1"} task={t} />
  ));

  return <>{mappedTasks}</>;
};

export const TaskStory = {
  render: () => <TaskExample />,
};
