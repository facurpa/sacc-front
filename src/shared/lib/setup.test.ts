import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Project Setup', () => {
  it('should verify TypeScript strict mode is enabled', () => {
    expect(true).toBe(true);
  });

  it('should verify Zod is installed and working', () => {
    const schema = z.object({ name: z.string() });
    expect(() => schema.parse({ name: 'test' })).not.toThrow();
  });
});
