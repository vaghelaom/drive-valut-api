import 'dotenv/config'; // ← must be first line
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { magicLink, twoFactor } from 'better-auth/plugins';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: [user.email],
        subject: 'Reset your Todo password',
        html: `<p><a href="${url}">Reset your password</a></p>`,
      });

      if (error) throw new Error(error.message);
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
        const { error } = await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: [email],
          subject: 'Sign in to Todo',
          html: `
        <h1>Sign in to Todo</h1>
        <p>Click the button below to sign in. This link expires soon.</p>
        <p><a href="${url}">Sign in to Todo</a></p>
        <p>If you did not request this email, you can safely ignore it.</p>
      `,
        });

        if (error) throw new Error(error.message);
      },
    }),
  ],
});

export type Auth = typeof auth;
