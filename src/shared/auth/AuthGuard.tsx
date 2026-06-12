'use client';

import { ReactNode } from 'react';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { apiTokenRequest } from '@/shared/auth/msal';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={apiTokenRequest}
    >
      {children}
    </MsalAuthenticationTemplate>
  );
}
