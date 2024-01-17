import { StateType, userReducer } from "./userReducer";

test("User reducer should increment only age", () => {
  const startState: StateType = { age: 22, weight: 93, name: "Daniil" };
  const endState = userReducer(startState, { type: "INCREMENT-AGE" });

  expect(endState.age).toBe(23);
  expect(endState.weight).toBe(93);
});

test("User reducer should burn weight", () => {
  const startState = { age: 22, weight: 92, name: "Daniil" };
  const endState = userReducer(startState, { type: "BURN-WEIGHT" });

  expect(endState.weight).toBe(91);
  expect(endState.age).toBe(22);
});

test("user reducer should change name of user", () => {
  const startState = { name: "Dimych", age: 20, weight: 2 };
  const newName = "Viktor";
  const endState = userReducer(startState, {
    type: "CHANGE-NAME",
    newName: newName,
  });

  expect(endState.name).toBe(newName);
});
