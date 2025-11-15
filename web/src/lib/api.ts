// lib/api.ts
import { HttpClient } from "./http";

export const api = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL,

  getToken: () => {
    return localStorage.getItem("token");
  },
});
