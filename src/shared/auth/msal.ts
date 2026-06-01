import {
  PublicClientApplication,
  BrowserCacheLocation,
  IPublicClientApplication,
  LogLevel,
} from '@azure/msal-browser';
import { env } from '@/shared/config/env';

let msalInstance: IPublicClientApplication | null = null;

export const getMsalConfig = () => ({
  auth: {
    clientId: env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: env.NEXT_PUBLIC_AZURE_REDIRECT_URI,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (process.env.NODE_ENV === 'development' && !containsPii) {
          console.log(`[MSAL] ${message}`);
        }
      },
    },
  },
});

export const getMsalInstance = (): IPublicClientApplication => {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(getMsalConfig());
  }
  return msalInstance;
};
