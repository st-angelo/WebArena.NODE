import { ObjectId } from 'mongoose';
import { AutoMap } from '../../utils/imports/automapper.mjs';
import { UserRole } from '../constants.mjs';

class User {
  _id: ObjectId;

  @AutoMap()
  tag: string;

  @AutoMap()
  email: string;

  @AutoMap()
  photo: string;

  role: UserRole;

  active: boolean;

  password: string;

  passwordChangedAt: Date;

  passwordResetToken: string | undefined;

  passwordResetExpires: Date | undefined;
}

export default User;
