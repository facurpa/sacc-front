import { useMemo } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { ApiError } from '@/shared/errors';
import { env } from '@/shared/config/env';
import { apiTokenRequest } from '@/shared/auth/msal';

export interface HttpClientOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
}

export type GetToken = () => Promise<string | null>;

export class HttpClient {
  private baseUrl: string;
  private getToken: GetToken;

  constructor(getToken: GetToken) {
    this.baseUrl = env.NEXT_PUBLIC_API_BASE_URL;
    this.getToken = getToken;
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

  private async buildHeaders(extra?: Record<string, string>): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extra,
    };

    const token = await this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
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
      headers: await this.buildHeaders(options?.headers),
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data?: unknown, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path), {
      method: 'POST',
      headers: await this.buildHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data?: unknown, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path), {
      method: 'PUT',
      headers: await this.buildHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'DELETE',
      headers: await this.buildHeaders(options?.headers),
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

export function createHttpClient(getToken: GetToken): HttpClient {
  return new HttpClient(getToken);
}

export function useHttpClient(): HttpClient {
  const { instance } = useMsal();

  return useMemo(() => {
    const getToken: GetToken = async () => {
      const accounts = instance.getAllAccounts();
      const account = instance.getActiveAccount() ?? accounts[0];
      if (!account) return null;

      try {
        const result = await instance.acquireTokenSilent({ ...apiTokenRequest, account });
        return result.accessToken;
      } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
          await instance.acquireTokenRedirect({ ...apiTokenRequest, account });
        }
        return null;
      }
    };

    return createHttpClient(getToken);
  }, [instance]);
}
