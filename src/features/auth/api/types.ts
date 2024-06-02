export type AuthMeDataResponseType = {
  id: number;
  email: string;
  login: string;
};
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
export type FieldsErrorsType = {
  field: string;
  error: string;
};
