import { z } from 'zod';

export const projectNameSchema = z
  .string()
  .min(3, 'Project name must be at least 3 characters')
  .max(50, 'Project name must be no more than 50 characters');

export type ProjectNameSchema = z.infer<typeof projectNameSchema>;
