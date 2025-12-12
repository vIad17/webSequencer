import { apiClient } from 'src/shared/api/apiClient';
import {
  setLoading,
  setProjectData
} from 'src/shared/redux/slices/projectSlice';

async function getProjectName(id: string) {
  const { data } = await apiClient.get(`/projects/${id}/name`);
  return data;
}

async function getProjectLink(id: string) {
  const { data } = await apiClient.get(`/projects/${id}/link`);
  return data;
}

async function getProjectUserId(id: string) {
  const { data } = await apiClient.get(`/projects/${id}/userId`);
  return data;
}

export const fetchProjectName = (project_id: string) => async (dispatch) => {
  try {
    dispatch(setProjectNameLoading(true));
    dispatch(setProjectNameError(null));

    const projectName = await getProjectName(project_id);

    if (!projectName) {
      throw new Error("Error receiving project's name");
    }

    dispatch(setProjectName(projectName));
  } catch (error) {
    dispatch(setProjectNameError(error.message));
  } finally {
    dispatch(setProjectNameLoading(false));
  }
};

export const fetchProjectData = (project_id: string) => async (dispatch) => {
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
  } catch (error) {
    console.warn('Failed to fetch project data:', error.message);
  } finally {
    dispatch(setProjectNameLoading(false));
  }
};

export const fetchProjectLink = (project_id: string) => async (dispatch) => {
  try {
    dispatch(setProjectLinkLoading(true));
    dispatch(setProjectLinkError(null));

    const projectLink = await getProjectLink(project_id);

    if (!projectLink) {
      throw new Error("Error receiving project's link");
    }

    dispatch(setProjectLink(projectLink));
  } catch (error) {
    dispatch(setProjectLinkError(error.message));
  } finally {
    dispatch(setProjectLinkLoading(false));
  }
};

export const fetchProjectUserId = (project_id: string) => async (dispatch) => {
  try {
    dispatch(setProjectUserIdLoading(true));
    dispatch(setProjectUserIdError(null));

    const projectUserId = await getProjectUserId(project_id);

    if (!projectUserId) {
      throw new Error("Error receiving project's user id");
    }

    dispatch(setProjectUserId(projectUserId));
  } catch (error) {
    dispatch(setProjectUserIdError(error.message));
  } finally {
    dispatch(setProjectUserIdLoading(false));
  }
};
