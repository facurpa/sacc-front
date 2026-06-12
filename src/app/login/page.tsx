'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Button } from '@/shared/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/components/card';
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
      <div className="flex h-screen items-center justify-center bg-neutral-50">
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
    <div className="flex h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-brand-primary">SACC</CardTitle>
          <CardDescription className="text-neutral-600">
            Sistema de Alertas Contábeis Cast
          </CardDescription>
          <p className="text-xs text-neutral-500 pt-2">
            Acesse com sua conta corporativa Microsoft
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleLogin}
          >
            Entrar com conta corporativa
          </Button>

          <p className="text-xs text-neutral-400 text-center">SACC v1.1</p>
        </CardContent>
      </Card>
    </div>
  );
}
