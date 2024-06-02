import { instance } from "../../../common/api";
import { AuthMeDataResponseType, LoginParamsType } from "./types";
import { ResponseType } from "../../../common/types";

export const authAPI = {
  setLogin: (loginData: LoginParamsType) =>
    instance.post<ResponseType<{ userId?: number }>>("auth/login", loginData),

  deleteLogin: () => instance.delete<ResponseType>("auth/login"),

  init: () => instance.get<ResponseType<AuthMeDataResponseType>>("auth/me"),
};
