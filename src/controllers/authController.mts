import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { add, format } from 'date-fns';
import { CookieOptions, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import UserDto from '../data/dto/userDto.mjs';
import User from '../data/entities/user.mjs';
import UserModel from '../data/models/userModel.mjs';
import sendEmail from '../services/emailService.mjs';
import { AppError } from '../utils/appError.mjs';
import { catchAsync } from '../utils/catchAsync.mjs';
import { verifyJWT } from '../utils/jwtHelpers.mjs';
import mapper from '../utils/mapper.mjs';

// #region Helpers

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

// #endregion

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await UserModel.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  createAndSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400));

  // 2. Check if user exists && password is correct
  const user = await UserModel.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password!', 401));

  // 3. If everything is ok, send token to client
  createAndSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check if exists
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    [, token] = authorization.split(' ');
  }
  if (!token)
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );

  // 2. Verification token
  const decoded = await verifyJWT(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const user = await UserModel.findById(decoded.id);
  if (!user)
    return next(
      new AppError('The user belonging to the token no longer exists', 401)
    );

  // 4. Check if user changed password after the JWT was issued
  if (!decoded.iat || userChangedPasswordAfter(user, decoded.iat))
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );

  // Grant acces to protected route
  req.user = user;
  next();
});

export const restrictTo =
  (roles: string[]) => (req, res, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    next();
  };

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on POSTed email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with that email address', 404));

  // 2. Generate the random reset token
  const resetToken = createPasswordResetToken(user);
  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}\nIf you didn't forget your password, please ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err: unknown) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        `There was an error sending the email. Try again later!`,
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token is invalid or has expired', 400));
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. Update changedPasswordAt property for the user

  // 4. Log the user in, send JWT
  createAndSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection
  const user = await UserModel.findById(req.user.id).select('+password');
  if (!user) return next(new AppError('User could not be found', 401));

  // 2. Check if POSTed password is correct
  if (!(await correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Your current password is wrong', 401));

  // 3. If so, update password
  user.password = req.body.password;
  await user.save();

  // 4. Log in user, send JWT
  createAndSendToken(user, 200, res);
});
