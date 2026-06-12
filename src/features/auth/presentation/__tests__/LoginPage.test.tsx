import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '@/app/login/page';
import { InteractionStatus } from '@azure/msal-browser';

const mockLoginRedirect = vi.fn();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: { loginRedirect: mockLoginRedirect },
    inProgress: InteractionStatus.None,
  }),
  useIsAuthenticated: () => false,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'Wrapper';
  return Wrapper;
};

describe('LoginPage', () => {
  it('renders the corporate login button', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByText('SACC')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Alertas Contábeis Cast')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /entrar com conta corporativa/i })
    ).toBeInTheDocument();
  });

  it('calls loginRedirect with API scopes on button click', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole('button', { name: /entrar com conta corporativa/i }));

    expect(mockLoginRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        scopes: expect.arrayContaining([expect.stringContaining('api://')]),
      })
    );
  });
});
