import { IPublicClientApplication } from '@azure/msal-browser';
import { ApiError, UnauthorizedError } from '@/shared/errors';
import { env } from '@/shared/config/env';

export interface HttpClientOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
}

export class HttpClient {
  private baseUrl: string;

  constructor(private msalInstance: IPublicClientApplication) {
    this.baseUrl = env.NEXT_PUBLIC_API_BASE_URL;
  }

  private async getAccessToken(): Promise<string> {
    try {
      const accounts = this.msalInstance.getAllAccounts();
      if (!accounts || accounts.length === 0) {
        throw new UnauthorizedError('No authenticated user');
      }

      const tokenRequest = {
        scopes: ['api://' + env.NEXT_PUBLIC_AZURE_CLIENT_ID + '/.default'],
        account: accounts[0],
      };

      const response = await this.msalInstance.acquireTokenSilent(tokenRequest);
      return response.accessToken;
    } catch (error) {
      throw new UnauthorizedError(
        error instanceof Error ? error.message : 'Failed to acquire token'
      );
    }
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
    const token = await this.getAccessToken();

    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data?: unknown, options?: HttpClientOptions): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(this.buildUrl(path), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data?: unknown, options?: HttpClientOptions): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(this.buildUrl(path), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options?: HttpClientOptions): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}
