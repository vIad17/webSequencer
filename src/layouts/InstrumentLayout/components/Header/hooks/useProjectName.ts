import { useCallback, useState } from 'react';

import { projectNameSchema } from 'src/layouts/InstrumentLayout/components/Header/lib/schema';
import { z } from 'zod';

import { useToast } from 'src/shared/hooks/useToast';

export const useProjectName = (initialName: string) => {
  const [projectName, setProjectName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const { toastError } = useToast();

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
      setTempName(projectName);
    }
  }, [isEditing, projectName]);

  const handleNameBlur = useCallback(() => {
    const validation = handleNameValidation(tempName);

    if (!validation.isValid) {
      toastError(validation.error!);
      setTempName(projectName);
    } else if (tempName.trim() === '') {
      toastError('Project name cannot be empty');
      setProjectName(projectName);
    } else {
      setProjectName(tempName.trim());
    }

    setIsEditing(false);
  }, [tempName, projectName, handleNameValidation, toastError]);

  const handleNameKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();

      if (e.key === 'Enter') {
        e.preventDefault();

        const validation = handleNameValidation(tempName);

        if (!validation.isValid) {
          toastError(validation.error!);
        } else if (tempName.trim() === '') {
          toastError('Project name cannot be empty');
        } else {
          setProjectName(tempName.trim());
          setIsEditing(false);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setTempName(projectName);
        setIsEditing(false);
      }
    },
    [tempName, projectName, handleNameValidation, toastError]
  );

  return {
    projectName,
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
