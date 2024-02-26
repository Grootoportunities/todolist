import AppWithRedux from "./AppWithRedux";
import { ReduxStoreProviderDecorator } from "../stories/ReduxStoreProviderDecorator";

export default {
  title: "App With Redux",
  component: AppWithRedux,
  decorators: [ReduxStoreProviderDecorator],
};

export const AppWithReduxExample = () => <AppWithRedux />;
