export type BaseActionType<T extends (...args: any) => any> = Omit<
  ReturnType<T>,
  "meta"
>;
