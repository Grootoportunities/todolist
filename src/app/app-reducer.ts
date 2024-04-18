export enum StatusesType {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

const initialState: AppStateType = {
  status: StatusesType.IDLE,
  error: null,
};

export const appReducer = (
  state: AppStateType = initialState,
  action: AppActionsType,
) => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export const setAppStatusAC = (status: StatusesType) =>
  ({
    type: "APP/SET-STATUS",
    status,
  }) as const;

export const setAppErorrAC = (error: string | null) =>
  ({
    type: "APP/SET-ERROR",
    error,
  }) as const;

//TYPES

export type AppStateType = {
  status: StatusesType;
  error: string | null;
};

export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorAT = ReturnType<typeof setAppErorrAC>;

export type AppActionsType = SetAppStatusAT | SetAppErrorAT;
