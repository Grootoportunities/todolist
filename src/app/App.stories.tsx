import App from "./App";
import { ReduxStoreProviderDecorator } from "../stories/ReduxStoreProviderDecorator";
import { MemoryRouter } from "react-router-dom";

export default {
  title: "App Stories",
  component: App,
  decorators: [ReduxStoreProviderDecorator],
};

export const AppExample = () => <App demo={true} />;
