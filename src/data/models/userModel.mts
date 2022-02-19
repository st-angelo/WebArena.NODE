import { Schema, Query, Document, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { UserRole as roles } from '../constants.mjs';
import User from '../entities/user.mjs';

type UserDocument = User & Document;

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
userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* Modify 'passwordChangedAt' before saving if 'password' was changed */
userSchema.pre<UserDocument>('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date();
  next();
});

/* Filter out inactive users */
userSchema.pre<Query<User, Document<User>>>(/^find/, function (next) {
  void this.find({ active: { $ne: false } });
  next();
});

const UserModel = model<User>('User', userSchema);

export default UserModel;
