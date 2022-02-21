import { Request } from 'express';
import User from '../data/entities/user.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}
