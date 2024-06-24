import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: { "API-KEY": "a918545c-774f-48b4-a615-795c2cc7eda0" },
});
