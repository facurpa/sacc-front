import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { InteractionStatus } from '@azure/msal-browser';
import { useSession } from '@/shared/auth/hooks';

const mockLogoutRedirect = vi.fn();

const msalState = {
  inProgress: InteractionStatus.None as string,
  isAuthenticated: false,
  account: null as object | null,
};

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: { logoutRedirect: mockLogoutRedirect },
    inProgress: msalState.inProgress,
  }),
  useIsAuthenticated: () => msalState.isAuthenticated,
  useAccount: () => msalState.account,
}));

const mockAccount = {
  localAccountId: 'local-1',
  name: 'Test User',
  username: 'test@company.com',
  idTokenClaims: { oid: 'oid-123', sub: 'sub-456' },
};

beforeEach(() => {
  msalState.inProgress = InteractionStatus.None;
  msalState.isAuthenticated = false;
  msalState.account = null;
  mockLogoutRedirect.mockReset();
});

describe('useSession', () => {
  it('returns loading during startup interaction', () => {
    msalState.inProgress = InteractionStatus.Startup;

    const { result } = renderHook(() => useSession());
    expect(result.current.status).toBe('loading');
    expect(result.current.user).toBeNull();
  });

  it('returns authenticated with mapped claims when account present', () => {
    msalState.isAuthenticated = true;
    msalState.account = mockAccount;

    const { result } = renderHook(() => useSession());
    expect(result.current.status).toBe('authenticated');
    expect(result.current.user).toEqual({
      id: 'oid-123',
      name: 'Test User',
      email: 'test@company.com',
    });
  });

  it('returns unauthenticated when no account', () => {
    const { result } = renderHook(() => useSession());
    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.user).toBeNull();
  });

  it('calls logoutRedirect when logout is invoked', async () => {
    msalState.isAuthenticated = true;
    msalState.account = mockAccount;

    const { result } = renderHook(() => useSession());
    await result.current.logout();
    expect(mockLogoutRedirect).toHaveBeenCalled();
  });
});
