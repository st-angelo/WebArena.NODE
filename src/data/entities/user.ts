import { AutoMap } from '@web-arena/es-named-imports/@automapper/classes';
import { ObjectId } from 'mongoose';
import { UserRole } from '../constants.js';

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
