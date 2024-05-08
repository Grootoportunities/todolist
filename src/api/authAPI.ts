import axios from "axios";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/auth/",
  withCredentials: true,
  headers: { "API-KEY": "3756001f-ecb0-4826-81eb-5a9af639abe5" },
});

export const authAPI = {
  setLogin: (loginData: LoginParamsType) =>
    instance.post<OperationResultType<{ userId?: number }>>("login", loginData),

  deleteLogin: () => instance.delete<OperationResultType>("login"),

  init: () => instance.get<OperationResultType<AuthMeDataResponseType>>("me"),
};

type AuthMeDataResponseType = { id: number; email: string; login: string };

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};

type OperationResultType<T = {}> = {
  resultCode: number;
  messages: string[];
  data: T;
};
