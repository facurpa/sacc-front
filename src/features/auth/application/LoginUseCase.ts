import { LoginFormInput } from '../domain/LoginSchema';
import { SessionUser } from '@/shared/auth/hooks';
import { httpClient } from '@/shared/http/client';
import { ApiError } from '@/shared/errors';

export const performLogin = async (credentials: LoginFormInput): Promise<SessionUser> => {
  try {
    const user = await httpClient.post<SessionUser>('/api/auth/login', {
      username: credentials.email,
      password: credentials.password,
    });
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new Error('Usuário ou senha incorretos');
    }
    throw new Error('Falha ao conectar. Tente novamente.');
  }
};
