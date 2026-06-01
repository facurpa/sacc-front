'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/shared/config/env';

export interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
}

const SESSION_QUERY_KEY = ['session'];
const SESSION_STALE_TIME = 1000 * 60 * 5; // 5 minutes

async function fetchSession(): Promise<SessionUser> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  return response.json();
}

async function performLogout(): Promise<void> {
  await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
}

export const useSession = () => {
  const queryClient = useQueryClient();

  const {
    data: user = null,
    isLoading,
    isError,
  } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSession,
    staleTime: SESSION_STALE_TIME,
    retry: false,
  });

  const status: 'loading' | 'authenticated' | 'unauthenticated' = isLoading
    ? 'loading'
    : isError
      ? 'unauthenticated'
      : user
        ? 'authenticated'
        : 'unauthenticated';

  const logout = async (): Promise<void> => {
    try {
      await performLogout();
    } finally {
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
    }
  };

  return {
    user,
    status,
    logout,
  };
};
