import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { twoFactor } from 'better-auth/plugins';
import { prisma } from '@repo/database';
import { env } from './env';

export const auth = betterAuth({
  appName: 'Weave Cash',
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  plugins: [nextCookies(), twoFactor()],
});

export type Auth = typeof auth;
