import { apiClient } from 'src/shared/api/apiClient';
import {
  setProjectLink,
  setProjectLinkError,
  setProjectLinkLoading
} from 'src/shared/redux/slices/projectLinkSlice';
import {
  setProjectName,
  setProjectNameError,
  setProjectNameLoading
} from 'src/shared/redux/slices/projectNameSlice';
import {
  setProjectUserId,
  setProjectUserIdError,
  setProjectUserIdLoading
} from 'src/shared/redux/slices/projectUserIdSlice';

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
