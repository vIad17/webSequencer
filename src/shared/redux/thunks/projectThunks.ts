import $api from 'src/shared/api/axiosConfig';
import $mockApi from 'src/shared/api/axiosMockConfig';
import {
  setError,
  setLoading,
  setProjectData
} from 'src/shared/redux/slices/projectSlice';

async function getProjectById(id: string) {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { data } = await $mockApi.get(`/projects/${id}`);
    return data;
  } else {
    const { data } = await $api.get(`/projects/${id}`);
    return data;
  }
}

export const fetchProjectData = (project_id: string) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const userData = await getProjectById(project_id);

    if (!userData) {
      throw new Error('Ошибка при получении данных проекта');
    }

    dispatch(setProjectData(userData));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
