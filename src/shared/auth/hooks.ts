'use client';

import { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { apiTokenRequest } from '@/shared/auth/msal';
import { env } from '@/shared/config/env';

export interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
}

export const useSession = () => {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount();

  const isLoading =
    inProgress === InteractionStatus.Startup ||
    inProgress === InteractionStatus.HandleRedirect ||
    inProgress === InteractionStatus.AcquireToken;

  let user: SessionUser | null = null;
  if (isAuthenticated && account) {
    const claims = account.idTokenClaims as Record<string, unknown> | undefined;
    user = {
      id: (claims?.oid as string) ?? (claims?.sub as string) ?? account.localAccountId,
      name: account.name ?? null,
      email: account.username ?? null,
    };
  }

  const status: 'loading' | 'authenticated' | 'unauthenticated' = isLoading
    ? 'loading'
    : isAuthenticated
      ? 'authenticated'
      : 'unauthenticated';

  const logout = async (): Promise<void> => {
    await instance.logoutRedirect({
      postLogoutRedirectUri: env.NEXT_PUBLIC_AZURE_REDIRECT_URI,
      ...apiTokenRequest,
    });
  };

  return { user, status, logout };
};
