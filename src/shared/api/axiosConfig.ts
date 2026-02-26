import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const API_URL = '/api';

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const $refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });

  failedQueue = [];
};

$api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

$api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return $api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await $refreshApi.post('/refresh');

        if (!response.data || !response.data.accessToken) {
          throw new Error('Invalid refresh response');
        }

        const { accessToken } = response.data;

        localStorage.setItem('accessToken', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);

        return $api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);

        localStorage.clear();

        try {
          await $refreshApi.post('/logout');
        } catch (logoutError) {
          console.error('Logout failed:', logoutError);
        }

        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default $api;
