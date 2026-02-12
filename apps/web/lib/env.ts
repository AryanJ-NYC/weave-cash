import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    DEFUSE_JWT_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DEFUSE_JWT_TOKEN: process.env.DEFUSE_JWT_TOKEN,
  },
  emptyStringAsUndefined: true,
});
