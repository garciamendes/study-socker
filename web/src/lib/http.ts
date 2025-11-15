// lib/httpClient.ts

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface HttpClientConfig {
  baseURL: string;
  getToken?: () => string | null; // interceptador opcional
}

export class HttpClient {
  private baseURL: string;
  getToken?: () => string | null;

  constructor(config: HttpClientConfig) {
    this.baseURL = config.baseURL;
    this.getToken = config.getToken;
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    data?: unknown
  ): Promise<T> {
    const token = this.getToken ? this.getToken() : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    // 🛑 Trata erros automaticamente
    if (!response.ok) {
      let errorBody = null;

      try {
        errorBody = await response.json();
      } catch {
        // ignore JSON parse error
      }

      throw new Error(errorBody?.message || `Erro ${response.status}`);
    }

    // Se não tiver body
    if (response.status === 204) return null as T;

    return (await response.json()) as T;
  }

  get<T>(url: string) {
    return this.request<T>("GET", url);
  }

  post<T>(url: string, data?: unknown) {
    return this.request<T>("POST", url, data);
  }

  patch<T>(url: string, data?: unknown) {
    return this.request<T>("PATCH", url, data);
  }

  delete<T>(url: string) {
    return this.request<T>("DELETE", url);
  }
}
