import { Task } from "./Task";
import { ReduxStoreProviderDecorator } from "../../stories/ReduxStoreProviderDecorator";
import { useSelector } from "react-redux";
import { RootStateType } from "../../state/store";
import { TaskType } from "../../api/tasksAPI";

export default {
  title: "Task",
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
};

const TaskExample = () => {
  let tasks = useSelector<RootStateType, TaskType[]>(
    (state) => state.tasks["todolistId1"],
  );

  const mappedTasks = tasks.map((t) => (
    <Task todolistId={"todolistId1"} task={t} />
  ));

  return <>{mappedTasks}</>;
};

export const TaskStory = {
  render: () => <TaskExample />,
};
