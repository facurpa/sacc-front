import { ApiError } from '@/shared/errors';
import { env } from '@/shared/config/env';

export interface HttpClientOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
}

export class HttpClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.NEXT_PUBLIC_API_BASE_URL;
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path.startsWith('http') ? path : this.baseUrl + path);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`, {
        url: response.url,
      });
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  async get<T>(path: string, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data?: unknown, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data?: unknown, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

export const httpClient = new HttpClient();
