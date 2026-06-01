import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { env } from '@/shared/config/env';

export const server = setupServer(
  http.get(`${env.NEXT_PUBLIC_API_BASE_URL}/health`, () => {
    return HttpResponse.json({ status: 'ok' });
  })
);
