import { api } from "@/lib/api";
import type { LoginSchemaType } from "./type";

export class AuthService {
  login({ username, password }: LoginSchemaType) {
    return api.post<{ access: string; refresh: string }>("/api/token/", {
      username,
      password,
    });
  }

  register(username: string, password: string) {
    return api.post<void>("/api/register", { username, password });
  }

  verify() {
    console.log("Entrou aqui");
    return api.post<void>("/api/register", {
      token: api.getToken?.() as string,
    });
  }
}

export const authService = new AuthService();
