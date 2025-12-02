import { authHandler } from './auth';
import { projectHandler } from './project';
import { projectHandlers } from './projects';
import { userHandler } from './users';

export const handlers = [
  ...authHandler,
  ...userHandler,
  ...projectHandler,
  ...projectHandlers
];
