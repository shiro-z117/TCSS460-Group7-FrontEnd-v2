// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// project import
import { authApi } from 'services/authApi';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPhoneNumber() {
  const areaCode = getRandomInt(100, 999);
  const centralOfficeCode = getRandomInt(100, 999);
  const lineNumber = getRandomInt(1000, 9999);
  return `${areaCode}-${centralOfficeCode}-${lineNumber}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',

      credentials: {
        mode: { type: 'text' },

        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        firstname: { label: 'First Name', type: 'text' },
        lastname: { label: 'Last Name', type: 'text' },
        username: { label: 'Username', type: 'text' }
      },

      async authorize(credentials) {
        try {
          if (!credentials) return null;

          // ---------------------
          // LOGIN FLOW
          // ---------------------
          if (credentials.mode === 'login') {
            const response = await authApi.login({
              email: credentials.email!,
              password: credentials.password!
            });

            const data = response.data.data;
            data.user['accessToken'] = data.accessToken;
            return data.user;
          }

          // ---------------------
          // REGISTER FLOW
          // ---------------------
          if (credentials.mode === 'register') {
            const response = await authApi.register({
              firstname: credentials.firstname!,
              lastname: credentials.lastname!,
              password: credentials.password!,
              email: credentials.email!,
              username: credentials.username!,
              phone: getRandomPhoneNumber()
            });

            const data = response.data.data;
            data.user['accessToken'] = data.accessToken;
            return data.user;
          }

          // reject if invalid credential mode is attempted
          if (!['login', 'register'].includes(credentials.mode)) {
            throw new Error('Invalid mode');
          }
        } catch (e: any) {
          console.error('=== AUTH ERROR CAUGHT ===');
          console.error('Error object:', e);

          // Handle different error formats
          let errorMessage = 'Something went wrong!';

          if (e?.error) {
            // Direct error property (your API format)
            errorMessage = e.error;
          } else if (e?.response?.data?.message) {
            // Axios error format
            errorMessage = e.response.data.message;
          } else if (e?.response?.data?.error) {
            // Alternative axios format
            errorMessage = e.response.data.error;
          } else if (e?.message) {
            // Standard error message
            errorMessage = e.message;
          }

          console.error('Final error message thrown:', errorMessage);
          throw new Error(errorMessage);
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // @ts-ignore
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.provider = token.provider;
        session.token = token;
      }
      return session;
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT!)
  },

  jwt: {
    secret: process.env.NEXT_APP_JWT_SECRET
  },

  pages: {
    signIn: '/login',
    newUser: '/register'
  }
};
