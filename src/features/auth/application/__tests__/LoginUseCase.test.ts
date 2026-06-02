import { describe, it, expect, afterEach } from 'vitest';
import { server } from '@/shared/http/mocks/server';
import { http, HttpResponse } from 'msw';
import { performLogin } from '../LoginUseCase';
import { env } from '@/shared/config/env';

describe('LoginUseCase', () => {
  afterEach(() => server.resetHandlers());

  it('should successfully login with valid credentials', async () => {
    const result = await performLogin({
      email: 'user@company.com',
      password: 'password123',
    });

    expect(result).toEqual({
      id: 'user-1',
      email: 'user@company.com',
      name: 'Test User',
    });
  });

  it('should throw generic error on 401 response', async () => {
    server.use(
      http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, () => {
        return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      })
    );

    await expect(
      performLogin({
        email: 'user@company.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Usuário ou senha incorretos');
  });

  it('should throw network error message on other failures', async () => {
    server.use(
      http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, () => {
        return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
      })
    );

    await expect(
      performLogin({
        email: 'user@company.com',
        password: 'password123',
      })
    ).rejects.toThrow('Falha ao conectar. Tente novamente.');
  });

  it('should call API with correct payload', async () => {
    let capturedRequest: { username: string; password: string } | null = null;

    server.use(
      http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, async ({ request }) => {
        capturedRequest = await request.json();
        return HttpResponse.json({
          id: 'user-1',
          email: 'test@company.com',
          name: 'Test User',
        });
      })
    );

    await performLogin({
      email: 'test@company.com',
      password: 'password123',
    });

    expect(capturedRequest).toEqual({
      username: 'test@company.com',
      password: 'password123',
    });
  });
});
