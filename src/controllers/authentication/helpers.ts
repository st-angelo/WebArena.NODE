import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { add, format } from 'date-fns';
import { CookieOptions, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import UserDto from '../../data/dto/userDto.js';
import User from '../../data/entities/user.js';
import mapper from '../../utils/mapper.js';

/**
 * Signs jwt token
 * @param {ObjectId} id
 * @returns {string}
 */
const signToken = (id: ObjectId): string =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/**
 * Creates token and sends back a response containing the user
 * @param {User} user
 * @param {number} statusCode
 * @param {Response} res
 */
const createAndSendToken = (user: User, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: mapper.map(user, UserDto, User),
    },
  });
};

/**
 * Checks if password was changed after the authentication token was emitted
 * @param {User} user
 * @param {number} jwtTimestamp
 * @returns {boolean}
 */
const userChangedPasswordAfter = (
  user: User,
  jwtTimestamp: number
): boolean => {
  if (user.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(
      format(user.passwordChangedAt, 't')
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

/**
 * Creates a token for resetting the password
 * @param {User} user
 * @returns {string}
 */
const createPasswordResetToken = (user: User): string => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpires = add(Date.now(), { minutes: 10 });

  return resetToken;
};

/**
 * Checks if given value is the valid password
 * @param {string} value
 * @param {string} currentPassword
 * @returns {Promise<boolean>}
 */
const correctPassword = (
  value: string,
  currentPassword: string
): Promise<boolean> => bcrypt.compare(value, currentPassword);

export default {
  signToken,
  createAndSendToken,
  userChangedPasswordAfter,
  createPasswordResetToken,
  correctPassword,
};
