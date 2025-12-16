import { AxiosError } from 'axios';

import { apiClient } from 'src/shared/api/apiClient';
import { setLoading, setUserData } from 'src/shared/redux/slices/userSlice';
import { SequencerDispatch } from 'src/shared/redux/store/store';

async function getUserInfo() {
  const { data } = await apiClient.get('/users/0');
  return data;
}

export const fetchUserData = () => async (dispatch: SequencerDispatch) => {
  if (!localStorage.getItem('accessToken')) {
    dispatch(setLoading(false));
    return;
  }

  try {
    dispatch(setLoading(true));

    const userData = await getUserInfo();

    if (!userData) {
      throw new Error("Error receiving user's data");
    }

    dispatch(setUserData(userData));
  } catch (e: unknown) {
    const error = e as AxiosError;
    console.warn('Failed to fetch user data:', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};
