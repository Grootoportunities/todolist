import {
  appReducer,
  AppStateType,
  setAppErorrAC,
  setAppStatusAC,
  StatusesType,
} from "./app-reducer";

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

  const endState = appReducer(startState, setAppErorrAC(error));

  expect(endState.error).toBe(error);
});

test("Status should be false", () => {
  const endState = appReducer(startState, setAppStatusAC(StatusesType.FAILED));

  expect(endState.status).toBe(StatusesType.FAILED);
});
