import { apiClient } from 'src/shared/api/apiClient';
import {
  setError,
  setLoading,
  setProjectData
} from 'src/shared/redux/slices/projectSlice';

async function getProjectById(id: string) {
  const { data } = await apiClient.get(`/projects/${id}`);
  return data;
}

export const fetchProjectData = (project_id: string) => async (dispatch) => {
  if (!localStorage.getItem('accessToken')) {
    dispatch(setLoading(false));
    return;
  }
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const userData = await getProjectById(project_id);

    if (!userData) {
      throw new Error("Error receiving project's data");
    }

    dispatch(setProjectData(userData));
  } catch (error) {
    console.warn('Failed to fetch user data:', error.message);
    dispatch(setError(null));
  } finally {
    dispatch(setLoading(false));
  }
};
