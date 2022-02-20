import { Request } from 'express';
import User from '../data/entities/user.mjs';

export interface AuthenticatedRequest extends Request {
  user?: User;
}
