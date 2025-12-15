import { AxiosError } from 'axios';

import { apiClient } from 'src/shared/api/apiClient';
import {
  setLoading,
  setProjectData
} from 'src/shared/redux/slices/projectSlice';
import { SequencerDispatch } from 'src/shared/redux/store/store';

async function getProjectById(id: string) {
  const { data } = await apiClient.get(`/projects/${id}`);
  return data;
}

export const fetchProjectData =
  (project_id: string) => async (dispatch: SequencerDispatch) => {
    if (!localStorage.getItem('accessToken')) {
      dispatch(setLoading(false));
      return;
    }
    try {
      dispatch(setLoading(true));

      const projectData = await getProjectById(project_id);

      if (!projectData) {
        throw new Error("Error receiving project's data");
      }

      dispatch(setProjectData(projectData));
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.warn('Failed to fetch project data:', error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
