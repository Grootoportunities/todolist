import App from "../ui/App";
import { ReduxStoreProviderDecorator } from "../../stories/ReduxStoreProviderDecorator";

export default {
  title: "App Stories",
  component: App,
  decorators: [ReduxStoreProviderDecorator],
};

export const AppExample = () => <App demo={true} />;
