import { AxiosError } from 'axios';

import { apiClient } from 'src/shared/api/apiClient';
import {
  setProjectLink,
  setProjectLinkLoading
} from 'src/shared/redux/slices/projectLinkSlice';
import {
  setProjectName,
  setProjectNameLoading
} from 'src/shared/redux/slices/projectNameSlice';
import {
  setProjectUserId,
  setProjectUserIdLoading
} from 'src/shared/redux/slices/projectUserIdSlice';

import { SequencerDispatch } from '../store/store';

async function getProjectName(id: string) {
  const { data } = await apiClient.get(`/projects/${id}/name`);
  return data.name;
}

async function getProjectLink(id: string) {
  const { data } = await apiClient.get(`/projects/${id}/link`);
  return data.link;
}

async function getProjectUserId(id: string) {
  const { data } = await apiClient.get(`/projects/${id}/userId`);
  return data.userId;
}

export const fetchProjectName =
  (project_id: string) => async (dispatch: SequencerDispatch) => {
    if (!localStorage.getItem('accessToken')) {
      dispatch(setProjectNameLoading(false));
      return;
    }
    try {
      dispatch(setProjectNameLoading(true));

      const projectName = await getProjectName(project_id);

      if (!projectName) {
        throw new Error("Error receiving project's name");
      }

      dispatch(setProjectName(projectName));
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.warn('Failed to fetch project name:', error.message);
    } finally {
      dispatch(setProjectNameLoading(false));
    }
  };

export const fetchProjectLink =
  (project_id: string) => async (dispatch: SequencerDispatch) => {
    if (!localStorage.getItem('accessToken')) {
      dispatch(setProjectLinkLoading(false));
      return;
    }
    try {
      dispatch(setProjectLinkLoading(true));

      const projectLink = await getProjectLink(project_id);

      if (!projectLink) {
        throw new Error("Error receiving project's link");
      }

      dispatch(setProjectLink(projectLink));
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.warn('Failed to fetch project link:', error.message);
    } finally {
      dispatch(setProjectLinkLoading(false));
    }
  };

export const fetchProjectUserId =
  (project_id: string) => async (dispatch: SequencerDispatch) => {
    if (!localStorage.getItem('accessToken')) {
      dispatch(setProjectUserIdLoading(false));
      return;
    }
    try {
      dispatch(setProjectUserIdLoading(true));

      const projectUserId = await getProjectUserId(project_id);

      if (!projectUserId) {
        throw new Error("Error receiving project's user id");
      }

      dispatch(setProjectUserId(projectUserId));
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.warn('Failed to fetch project user id:', error.message);
    } finally {
      dispatch(setProjectUserIdLoading(false));
    }
  };
