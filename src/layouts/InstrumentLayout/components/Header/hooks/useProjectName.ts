import { useCallback, useEffect, useState } from 'react';

import { projectNameSchema } from 'src/layouts/InstrumentLayout/components/Header/lib/schema';
import { z } from 'zod';

import $api from 'src/shared/api/axiosConfig';
import { useToast } from 'src/shared/hooks/useToast';

export const useProjectName = (initialName: string, projectId?: number) => {
  const [projectName, setProjectName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [isLoading, setIsLoading] = useState(false);

  const { toastError } = useToast();

  useEffect(() => {
    if (projectId && import.meta.env.VITE_USE_MOCKS === 'true') {
      setIsLoading(true);
      $api
        .get(`/projects/${projectId}/name`)
        .then((response) => {
          setProjectName(response.data.name);
          setTempName(response.data.name);
        })
        .catch((error) => {
          toastError('Failed to load project name');
        })
        .finally(() => setIsLoading(false));
    }
  }, [projectId]);

  const handleNameValidation = useCallback(
    (name: string): { isValid: boolean; error?: string } => {
      try {
        projectNameSchema.parse(name.trim());
        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            isValid: false,
            error: error.issues[0]?.message || 'Invalid project name'
          };
        }
        return { isValid: false, error: 'Invalid project name' };
      }
    },
    []
  );

  const handleNameClick = useCallback(() => {
    if (!isEditing && !isLoading) {
      setIsEditing(true);
      setTempName(projectName);
    }
  }, [isEditing, projectName, isLoading]);

  const handleNameBlur = useCallback(async () => {
    const validation = handleNameValidation(tempName);

    if (!validation.isValid) {
      toastError(validation.error!);
      setTempName(projectName);
    } else if (tempName.trim() === '') {
      toastError('Project name cannot be empty');
      setTempName(projectName);
    } else if (tempName.trim() !== projectName && projectId) {
      try {
        await $api.put(`/projects/${projectId}`, {
          name: tempName.trim()
        });
        setProjectName(tempName.trim());
      } catch (error) {
        toastError('Failed to update project name');
        setTempName(projectName);
      }
    }

    setIsEditing(false);
  }, [tempName, projectName, projectId, handleNameValidation, toastError]);

  const handleNameKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();

      if (e.key === 'Enter') {
        e.preventDefault();

        const validation = handleNameValidation(tempName);

        if (!validation.isValid) {
          toastError(validation.error!);
          return;
        }

        if (tempName.trim() === '') {
          toastError('Project name cannot be empty');
          return;
        }

        if (tempName.trim() !== projectName && projectId) {
          try {
            await $api.put(`/projects/${projectId}`, {
              name: tempName.trim()
            });
            setProjectName(tempName.trim());
          } catch (error) {
            toastError('Failed to update project name');
            return;
          }
        }

        setIsEditing(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setTempName(projectName);
        setIsEditing(false);
      }
    },
    [tempName, projectName, projectId, handleNameValidation, toastError]
  );

  return {
    projectName,
    isEditing,
    tempName,
    isLoading,
    setIsEditing,
    setTempName,
    handleNameClick,
    handleNameBlur,
    handleNameKeyDown,
    handleNameValidation
  };
};
