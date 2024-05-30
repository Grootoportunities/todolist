import {
  appActions,
  applicationReducer,
  StatusesType,
} from "./application-reducer";

type AppStateType = {
  status: StatusesType;
  error: string | null;
  isInit: boolean;
};

let startState: AppStateType;

beforeEach(() => {
  startState = {
    status: StatusesType.IDLE,
    error: null,
    isInit: false,
  };
});

test("Error should occurre", () => {
  const error = "Some error occurred";

  const endState = applicationReducer(
    startState,
    appActions.setAppError({ error }),
  );

  expect(endState.error).toBe(error);
});

test("Status should be false", () => {
  const endState = applicationReducer(
    startState,
    appActions.setAppStatus({ status: StatusesType.FAILED }),
  );

  expect(endState.status).toBe(StatusesType.FAILED);
});
