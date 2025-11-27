import { authHandler } from './auth';
import { projectHandler } from './project';
import { userHandler } from './users';

export const handlers = [...authHandler, ...userHandler, ...projectHandler];
