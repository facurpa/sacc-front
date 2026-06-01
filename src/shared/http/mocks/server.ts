import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { env } from '@/shared/config/env';

export const server = setupServer(
  http.get(`${env.NEXT_PUBLIC_API_BASE_URL}/health`, () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, () => {
    return HttpResponse.json(
      { id: 'user-1', email: 'user@company.com', name: 'Test User' },
      {
        headers: {
          'Set-Cookie':
            'Authorization=mock-jwt-token; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600',
        },
      }
    );
  }),

  http.get(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, () => {
    return HttpResponse.json({ id: 'user-1', email: 'user@company.com', name: 'Test User' });
  }),

  http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        'Set-Cookie': 'Authorization=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
      },
    });
  }),

  http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`, () => {
    return HttpResponse.json({ ok: true });
  })
);
