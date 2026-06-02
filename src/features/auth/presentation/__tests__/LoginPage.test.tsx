import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '@/shared/http/mocks/server';
import { http, HttpResponse } from 'msw';
import LoginPage from '@/app/login/page';
import { env } from '@/shared/config/env';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock useSession hook
vi.mock('@/shared/auth/hooks', () => ({
  useSession: () => ({
    user: null,
    status: 'unauthenticated',
    logout: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('LoginPage', () => {
  afterEach(() => server.resetHandlers());

  it('should render login form', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByText('SACC')).toBeInTheDocument();
    expect(screen.getByText('Sistema de Alertas Contábeis Cast')).toBeInTheDocument();
    expect(screen.getByLabelText('Usuário')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText('Usuário');
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Usuário deve ser um e-mail corporativo válido')).toBeInTheDocument();
    });
  });

  it('should show validation error for empty fields on submit', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Usuário é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  it('should show error message on 401 response', async () => {
    const user = userEvent.setup();

    server.use(
      http.post(`${env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, () => {
        return HttpResponse.json({ error: 'Invalid' }, { status: 401 });
      })
    );

    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'user@company.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Usuário ou senha incorretos')).toBeInTheDocument();
    });
  });

  it('should disable form during submission', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText('Usuário') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /entrar/i }) as HTMLButtonElement;

    await user.type(emailInput, 'user@company.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Check button text changes
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Entrando...');
    });

    // Check inputs are disabled
    expect(emailInput.disabled).toBe(true);
    expect(passwordInput.disabled).toBe(true);
  });

  it('should clear field errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText('Usuário');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    // Submit without email to trigger error
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Usuário é obrigatório')).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(emailInput, 'user@company.com');

    await waitFor(() => {
      expect(screen.queryByText('Usuário é obrigatório')).not.toBeInTheDocument();
    });
  });

  it('should set autofocus on email field', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText('Usuário') as HTMLInputElement;
    expect(emailInput).toHaveFocus();
  });

  it('should have proper accessibility attributes', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
});
