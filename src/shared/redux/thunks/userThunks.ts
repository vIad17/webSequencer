import { apiClient } from 'src/shared/api/apiClient';
import {
  setError,
  setLoading,
  setUserData
} from 'src/shared/redux/slices/userSlice';

async function getUserInfo() {
  const { data } = await apiClient.get('/users/0');
  return data;
}

export const fetchUserData = () => async (dispatch) => {
  if (!localStorage.getItem('accessToken')) {
    dispatch(setLoading(false));
    return;
  }

  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const userData = await getUserInfo();

    if (!userData) {
      throw new Error("Error receiving user's data");
    }

    dispatch(setUserData(userData));
  } catch (error) {
    console.warn('Failed to fetch user data:', error.message);
    dispatch(setError(null));
  } finally {
    dispatch(setLoading(false));
  }
};
