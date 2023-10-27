import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './database';
import { compare } from 'bcrypt';
import { Staff, StaffType } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: '',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.staff.findFirst({
          where: {
            email: {
              equals: credentials.email,
              mode: 'insensitive',
            },
          },
        });
        if (!user) return null;
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.type,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (!user) return token;
      const u = user as {
        id: string;
        type: StaffType;
        email: string;
        name: string;
      };
      return {
        ...token,
        id: u.id,
        role: u.type,
      };
    },
    session: ({ token, session }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: StaffType;
};

export const getAuthUser = async () => {
  const session = (await getServerSession(authOptions)) as {
    user: AuthUser;
  } | null;
  return session?.user;
};
