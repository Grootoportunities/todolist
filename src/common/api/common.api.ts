import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: { "API-KEY": "e495278a-c2d8-4576-bed3-b59cbb54bf9d" },
});
