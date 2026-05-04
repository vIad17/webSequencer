import { z } from 'zod';

export const projectNameSchema = (isOwner: boolean = false) =>
  z
    .string()
    .min(isOwner ? 3 : 0, 'Project name must be at least 3 characters')
    .max(50, 'Project name must be no more than 50 characters');

export type ProjectNameSchema = z.infer<ReturnType<typeof projectNameSchema>>;