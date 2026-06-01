import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url('API Base URL must be a valid URL'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.1.0'),
  NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES: z.coerce.number().default(30),
});

export type Env = z.infer<typeof envSchema>;

const getEnv = (): Env => {
  // In tests, provide default values
  const testEnv = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
    NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES: process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES || '30',
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
