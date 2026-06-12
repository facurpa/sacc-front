import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url('API Base URL must be a valid URL'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.1.0'),
  NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES: z.coerce.number().default(30),
  NEXT_PUBLIC_AZURE_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_AZURE_TENANT_ID: z.string().min(1),
  NEXT_PUBLIC_AZURE_API_SCOPE: z.string().min(1),
  NEXT_PUBLIC_AZURE_REDIRECT_URI: z.string().url('Redirect URI must be a valid URL'),
});

export type Env = z.infer<typeof envSchema>;

const getEnv = (): Env => {
  const testEnv = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
    NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES: process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES || '30',
    NEXT_PUBLIC_AZURE_CLIENT_ID:
      process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '00000000-0000-0000-0000-000000000000',
    NEXT_PUBLIC_AZURE_TENANT_ID:
      process.env.NEXT_PUBLIC_AZURE_TENANT_ID || '00000000-0000-0000-0000-000000000001',
    NEXT_PUBLIC_AZURE_API_SCOPE:
      process.env.NEXT_PUBLIC_AZURE_API_SCOPE ||
      'api://00000000-0000-0000-0000-000000000002/access_as_user',
    NEXT_PUBLIC_AZURE_REDIRECT_URI:
      process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI || 'http://localhost:3000',
  };

  try {
    return envSchema.parse(testEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

export const env = getEnv();
