export type BaseActionType<T extends (...args: any) => any> = Omit<
  ReturnType<T>,
  "meta"
>;

export type ThunkAPIConfigType = {
  rejectValue: { errors: string[]; fieldsErrors: FieldsErrorsType[] } | null;
};

export type ResponseType<D = {}> = {
  data: D;
  messages: string[];
  fieldsErrors: FieldsErrorsType[];
  resultCode: number;
};

export type FieldsErrorsType = {
  field: string;
  error: string;
};
