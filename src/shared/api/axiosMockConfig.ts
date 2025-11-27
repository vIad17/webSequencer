import axios from 'axios';

const $mockApi = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function login() {
  try {
    const response = await axios.post('/login', {
      username: 'Artem',
      password: '1234'
    });
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.accessToken;
  } catch {
    throw new Error('Login failed');
  }
}

$mockApi.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');
    if (!token) {
      token = await login();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$mockApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await login();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return $mockApi(originalRequest);
      } catch (loginError) {
        return Promise.reject(loginError);
      }
    }

    return Promise.reject(error);
  }
);

export default $mockApi;
