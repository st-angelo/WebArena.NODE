import { UserRole } from '../constants.mjs';

interface User {
  tag: string;
  email: string;
  photo: string;
  role: UserRole;
  active: boolean;
  password: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
}

export default User;
