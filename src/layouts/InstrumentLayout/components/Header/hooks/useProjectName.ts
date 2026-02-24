import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { projectNameSchema } from 'src/layouts/InstrumentLayout/components/Header/lib/schema';
import { z } from 'zod';

import { apiClient } from 'src/shared/api/apiClient';
import { useToast } from 'src/shared/hooks/useToast';
import { setProjectName } from 'src/shared/redux/slices/projectNameSlice';
import { RootState, SequencerDispatch } from 'src/shared/redux/store/store';
import { fetchProjectName } from 'src/shared/redux/thunks/projectThunks';

export const useProjectName = (initialName: string) => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(initialName);
  const dispatch = useDispatch<SequencerDispatch>();

  const { name } = useSelector((state: RootState) => state.projectName);

  const { toastError } = useToast();

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectName(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    setTempName(name);
  }, [name]);

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
    if (!isEditing) {
      setIsEditing(true);
      setTempName(name);
    }
  }, [isEditing, name]);

  const handleNameBlur = useCallback(async () => {
    const validation = handleNameValidation(tempName);

    if (!validation.isValid) {
      toastError(validation.error!);
      setTempName(name);
    } else if (tempName.trim() === '') {
      toastError('Project name cannot be empty');
      setTempName(name);
    } else if (tempName.trim() !== name && id) {
      try {
        await apiClient.put(`/projects/${id}`, {
          name: tempName.trim()
        });
        dispatch(setProjectName(tempName.trim()));
      } catch (error) {
        toastError("You can't modify project name");
        setTempName(name);
      }
    }

    setIsEditing(false);
  }, [tempName, name, id, handleNameValidation, toastError]);

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

        if (tempName.trim() !== name && id) {
          try {
            await apiClient.put(`/projects/${id}`, {
              name: tempName.trim()
            });
            dispatch(setProjectName(tempName.trim()));
          } catch (error) {
            toastError("You can't modify project name");
            return;
          }
        }

        setIsEditing(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setTempName(name);
        setIsEditing(false);
      }
    },
    [tempName, name, id, handleNameValidation, toastError]
  );

  return {
    name,
    isEditing,
    tempName,
    setIsEditing,
    setTempName,
    handleNameClick,
    handleNameBlur,
    handleNameKeyDown,
    handleNameValidation
  };
};
