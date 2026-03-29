import $api from 'src/shared/api/axiosConfig';
import $mockApi from 'src/shared/api/axiosMockConfig';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const apiClient = useMocks ? $mockApi : $api;
