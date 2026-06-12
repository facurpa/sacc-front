'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Button } from '@/shared/ui/components/button';
import { Card, CardContent } from '@/shared/ui/components/card';
import { apiTokenRequest } from '@/shared/auth/msal';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const isLoading =
    inProgress === InteractionStatus.Startup ||
    inProgress === InteractionStatus.HandleRedirect ||
    inProgress === InteractionStatus.AcquireToken;

  useEffect(() => {
    if (isAuthenticated) {
      const returnTo = searchParams.get('returnTo') ?? '/dashboard';
      router.push(returnTo);
    }
  }, [isAuthenticated, router, searchParams]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,var(--color-brand-gradient-from),var(--color-brand-gradient-to))]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-brand-primary" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-brand-primary delay-100" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-brand-primary delay-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogin = () => {
    instance.loginRedirect(apiTokenRequest);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,var(--color-brand-gradient-from),var(--color-brand-gradient-to))] px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardContent className="space-y-6 p-8 sm:p-10">
          {/* Shield Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary">
            <svg
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl font-semibold text-neutral-900">SACC</h1>

          {/* Subtitle */}
          <p className="text-center text-sm text-neutral-500">
            Sistema de Alertas de Contas Contábeis
          </p>

          {/* Login Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleLogin}
          >
            Entrar com Microsoft
          </Button>

          {/* Azure AD Legend */}
          <p className="text-center text-sm text-neutral-500">
            Autenticação via Azure Active Directory
          </p>

          {/* Divider */}
          <hr className="border-neutral-200" />

          {/* Footer */}
          <p className="text-center text-sm text-neutral-500">
            Governança Corporativa • Auditabilidade • Compliance
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
