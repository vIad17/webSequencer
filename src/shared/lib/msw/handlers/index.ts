import { authHandler } from './auth';
import { userHandler } from './users';

export const handlers = [...authHandler, ...userHandler];
