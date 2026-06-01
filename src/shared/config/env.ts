import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_AZURE_TENANT_ID: z.string().min(1, 'Azure Tenant ID is required'),
  NEXT_PUBLIC_AZURE_CLIENT_ID: z.string().min(1, 'Azure Client ID is required'),
  NEXT_PUBLIC_AZURE_REDIRECT_URI: z.string().url('Azure Redirect URI must be a valid URL'),
  NEXT_PUBLIC_API_BASE_URL: z.string().url('API Base URL must be a valid URL'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.1.0'),
});

export type Env = z.infer<typeof envSchema>;

const getEnv = (): Env => {
  // In tests, provide default values
  const testEnv = {
    NEXT_PUBLIC_AZURE_TENANT_ID: process.env.NEXT_PUBLIC_AZURE_TENANT_ID || 'test-tenant',
    NEXT_PUBLIC_AZURE_CLIENT_ID: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || 'test-client',
    NEXT_PUBLIC_AZURE_REDIRECT_URI:
      process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI || 'http://localhost:3000',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
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
