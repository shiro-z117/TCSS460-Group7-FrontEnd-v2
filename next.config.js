/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '**'
      }
    ]
  },
  env: {
    NEXT_APP_VERSION: '1.0.0',

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET_KEY,
    NEXTAUTH_SECRET_KEY: process.env.NEXTAUTH_SECRET_KEY,
    NEXTAUTH_URL: 'http://localhost:3000',

    SHOWS_WEB_API_URL: 'https://g1-tvapi.onrender.com',
    SHOWS_WEB_API_KEY: process.env.SHOWS_WEB_API_KEY,


    MOVIES_WEB_API_URL: process.env.MOVIES_WEB_API_URL || 'https://dataset-web-api.onrender.com/api',
    MOVIES_WEB_API_KEY: process.env.MOVIES_WEB_API_KEY,

    MESSAGES_WEB_API_URL: process.env.MESSAGES_WEB_API_URL,
    MESSAGES_WEB_API_KEY: process.env.MESSAGES_WEB_API_KEY,

    CREDENTIALS_API_URL: 'https://credentials-api-group2-20f368b8528b.herokuapp.com/',
    USER_DB_API_URL: process.env.USER_DB_API_URL || 'https://pibble-user-db.onrender.com',

    NEXT_APP_JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
    NEXT_APP_JWT_TIMEOUT: process.env.REACT_APP_JWT_TIMEOUT,

    NEXT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  }
};

module.exports = nextConfig;
