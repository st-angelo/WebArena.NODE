import crypto from 'crypto';
import { Schema, Query, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { add, format } from 'date-fns';
import { UserRole as roles } from '../constants.mjs';
import User from '../entities/user.mjs';

const userSchema = new Schema<User>({
  tag: {
    type: String,
    required: [true, 'A tag is required'],
  },
  email: {
    type: String,
    required: [true, 'An email is required'],
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, 'Provided email is invalid'],
  },
  photo: String,
  role: {
    type: String,
    enum: [roles.Admin, roles.Creator, roles.Moderator, roles.Player],
    default: roles.Player,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

/* Encrypt 'password' before saving if password was modified */
userSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* Modify 'passwordChangedAt' before saving if 'password' was changed */
userSchema.pre<User>('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date();
  next();
});

/* Filter out inactive users */
userSchema.pre<Query<User, User>>(/^find/, function (next) {
  void this.find({ active: { $ne: false } });
  next();
});

/* Checks if given value is the valid password */
userSchema.method<User>('correctPassword', function (value: string) {
  return bcrypt.compare(value, this.password);
});

/* Checks if password was changed after the authentication token was emitted */
userSchema.method<User>(
  'changedPasswordAfter',
  function (jwtTimestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = Number.parseInt(
        format(this.passwordChangedAt, 't')
      );
      return jwtTimestamp < changedTimestamp;
    }
    return false;
  }
);

/* Creates a token for resetting the password */
userSchema.method<User>('createPasswordResetToken', function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = add(Date.now(), { minutes: 10 });

  return resetToken;
});

const UserModel = model<User>('User', userSchema);

export default UserModel;
