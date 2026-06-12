import { PublicClientApplication } from '@azure/msal-browser';
import { env } from '@/shared/config/env';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: env.NEXT_PUBLIC_AZURE_REDIRECT_URI,
    postLogoutRedirectUri: env.NEXT_PUBLIC_AZURE_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
});

export const apiTokenRequest = {
  scopes: [env.NEXT_PUBLIC_AZURE_API_SCOPE],
};
