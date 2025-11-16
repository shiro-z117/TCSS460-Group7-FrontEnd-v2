/** @type {import('next').NextConfig} */
const nextConfig = {
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

    SHOWS_WEB_API_URL: 'https://g1-tvapi.onrender.com/',
    SHOWS_WEB_API_KEY: process.env.SHOWS_WEB_API_KEY,

    MOVIES_WEB_API_URL: 'https://dataset-web-api.onrender.com/',
    MOVIES_WEB_API_KEY: process.env.MOVIES_WEB_API_KEY,

    CREDENTIALS_API_URL: process.env.CREDENTIALS_API_URL || 'https://tcss460-group7-credential-api-8zqv.onrender.com',

    NEXT_APP_JWT_SECRET: process.env.REACT_APP_JWT_SECRET,
    NEXT_APP_JWT_TIMEOUT: process.env.REACT_APP_JWT_TIMEOUT,

    NEXT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  }
};

module.exports = nextConfig;
