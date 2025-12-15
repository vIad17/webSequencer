import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const API_URL = '/api';

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await $api.post('/refresh');

        localStorage.setItem('accessToken', data.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return $api(originalRequest);
      } catch (refreshError) {
        await $api.post('/logout');
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
    }

    return Promise.reject(error);
  }
);

export default $api;
