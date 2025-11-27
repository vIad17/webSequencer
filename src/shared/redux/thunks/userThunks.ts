import $api from 'src/shared/api/axiosConfig';
import $mockApi from 'src/shared/api/axiosMockConfig';
import {
  setError,
  setLoading,
  setUserData
} from 'src/shared/redux/slices/userSlice';

async function getUserInfo() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { data } = await $mockApi.get('/users/0');
    return data;
  } else {
    const { data } = await $api.get('/users/0');
    return data;
  }
}

export const fetchUserData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const userData = await getUserInfo();

    if (!userData) {
      throw new Error('Ошибка при получении данных пользователя');
    }

    dispatch(setUserData(userData));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
