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
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const userData = await getProjectById(project_id);

    if (!userData) {
      throw new Error("Error receiving project's data");
    }

    dispatch(setProjectData(userData));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
