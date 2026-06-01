'use client';

import { useMsal } from '@azure/msal-react';

export interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
}

export const useSession = () => {
  const { accounts, inProgress } = useMsal();

  const user: SessionUser | null =
    accounts.length > 0
      ? {
          id: accounts[0].homeAccountId,
          name: accounts[0].name ?? null,
          email: accounts[0].username ?? null,
        }
      : null;

  const isAuthenticated = accounts.length > 0;
  const isLoading = inProgress !== 'none';

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
