// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// project import
import { authApi } from 'services/authApi';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const response = await authApi.login({
            email: credentials?.email!,
            password: credentials?.password!
          });

          if (response) {
            // TODO form your user object based on the Credentials API you're using.
            // Check their API docs.
            // console.dir(response.data);
            const data = response.data.data;
            data.user['accessToken'] = data.accessToken;
            return data.user;
          }
        } catch (e: any) {
          console.error(e);
          const errorMessage = e?.message || e?.response?.data?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    }),
    CredentialsProvider({
      id: 'register',
      name: 'register',
      credentials: {
        firstname: { name: 'firstname', label: 'First Name', type: 'text', placeholder: 'Enter First Name' },
        lastname: { name: 'lastname', label: 'Last Name', type: 'text', placeholder: 'Enter Last Name' },
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        username: { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter Username' },
        phone: { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter Phone Number' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const response = await authApi.register({
            firstname: credentials?.firstname!,
            lastname: credentials?.lastname!,
            email: credentials?.email!,
            username: credentials?.username!,
            phone: credentials?.phone!,
            password: credentials?.password!
          });
          if (response) {
            // TODO form your user object based on the Credentials API you're using.
            // Check their API docs.
            // console.dir(response.data);
            const data = response.data.data;
            data.user['accessToken'] = data.accessToken;
            return data.user;
          }
        } catch (e: any) {
          console.error(e);
          const errorMessage = e?.message || e?.response?.data?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        // @ts-ignore
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
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
