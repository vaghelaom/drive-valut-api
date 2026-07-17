import 'dotenv/config'; // ← must be first line
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { magicLink, twoFactor } from 'better-auth/plugins';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  trustedOrigins: ['http://localhost:5500'],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // for now: log it, so you can copy-paste the link manually to test
      console.log(`Reset link for ${user.email}: ${url}`);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log(`Magic link for ${email}: ${url}`);
      },
    }),
    twoFactor({
      issuer: 'Todo', // shown in the user's authenticator app
    }),
    // ...any plugins you already have, like the ones from your Zod/nestjs-zod setup
  ],
});

export type Auth = typeof auth;
