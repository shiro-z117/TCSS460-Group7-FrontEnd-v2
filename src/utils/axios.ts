import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// next
import { getSession } from 'next-auth/react';

// ==============================|| ENVIRONMENT VALIDATION ||============================== //

if (!process.env.CREDENTIALS_API_URL) {
  throw new Error(
    'CREDENTIALS_API_URL environment variable is not set. ' +
    'Please add CREDENTIALS_API_URL to your .env and/or next.config.js file(s). ' +
    'Example: CREDENTIALS_API_URL=http://localhost:8008'
  );
}

if (!process.env.MOVIES_WEB_API_URL) {
  throw new Error(
    'MOVIES_WEB_API_URL environment variable is not set. ' +
    'Please add MOVIES_WEB_API_URL to your .env and/or next.config.js file(s). ' +
    'Example: MOVIES_WEB_API_URL=https://dataset-web-api.onrender.com/api'
  );
}

if (!process.env.MOVIES_WEB_API_KEY) {
  throw new Error(
    'MOVIES_WEB_API_KEY environment variable is not set. ' +
    'Please add MOVIES_WEB_API_KEY to your .env and/or next.config.js file(s). ' +
    'Example: MOVIES_WEB_API_KEY=your-api-key-here'
  );
}

if (!process.env.SHOWS_WEB_API_URL) {
  throw new Error(
    'SHOWS_WEB_API_URL environment variable is not set. ' +
    'Please add SHOWS_WEB_API_URL to your .env and/or next.config.js file(s). ' +
    'Example: SHOWS_WEB_API_URL=https://g1-tvapi.onrender.com/'
  );
}

if (!process.env.SHOWS_WEB_API_KEY) {
  throw new Error(
    'SHOWS_WEB_API_KEY environment variable is not set. ' +
    'Please add SHOWS_WEB_API_KEY to your .env and/or next.config.js file(s). ' +
    'Example: SHOWS_WEB_API_KEY=your-api-key-here'
  );
}

// ==============================|| CREDENTIALS SERVICE ||============================== //

const credentialsService = axios.create({ baseURL: process.env.CREDENTIALS_API_URL });

credentialsService.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();
    if (session?.token.accessToken) {
      config.headers['Authorization'] = `Bearer ${session?.token.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

credentialsService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config || {};
      console.error('Connection refused. The Auth/Web API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status && error.response.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    } else if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Don't auto-redirect on auth-related pages (login, register, forgot-password, reset-password)
      const authPages = ['/login', '/register', '/forgot-password', '/reset-password', '/check-mail'];
      const currentPath = window.location.pathname;
      const isAuthPage = authPages.some(page => currentPath.includes(page));

      if (!isAuthPage) {
        window.location.pathname = '/login';
      }
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| MOVIE SERVICE ||============================== //

const movieService = axios.create({ baseURL: process.env.MOVIES_WEB_API_URL });

movieService.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers['Authorization'] = `Bearer ${process.env.MOVIES_WEB_API_KEY || 'dev-key'}`;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

movieService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config || {};
      console.error('Connection refused. The Movie API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status && error.response.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    } else if (error.response?.status === 401) {
      return Promise.reject({ message: 'Unauthorized - Invalid API key' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| SHOWS SERVICE ||============================== //

const showsService = axios.create({ baseURL: process.env.SHOWS_WEB_API_URL });

showsService.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers['X-API-Key'] = process.env.SHOWS_WEB_API_KEY;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

showsService.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config || {};
      console.error('Connection refused. The TV Shows API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status && error.response.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    } else if (error.response?.status === 401) {
      return Promise.reject({ message: 'Unauthorized - Invalid API key' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| EXPORTS ||============================== //

export default credentialsService; // Maintain backward compatibility
export { credentialsService, movieService, showsService };

// Credentials service helpers
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.post(url, { ...config });

  return res.data;
};

// Movie service helpers
export const movieFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await movieService.get(url, { ...config });

  return res.data;
};

export const movieFetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await movieService.post(url, { ...config });

  return res.data;
};

export const movieFetcherPatch = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await movieService.patch(url, { ...config });

  return res.data;
};

export const movieFetcherDelete = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await movieService.delete(url, { ...config });

  return res.data;
};

// TV Shows service helpers
export const showsFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await showsService.get(url, { ...config });

  return res.data;
};

export const showsFetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await showsService.post(url, { ...config });

  return res.data;
};

export const showsFetcherPut = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await showsService.put(url, { ...config });

  return res.data;
};

export const showsFetcherDelete = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await showsService.delete(url, { ...config });

  return res.data;
};
