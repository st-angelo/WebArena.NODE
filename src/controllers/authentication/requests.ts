import { Request } from 'express';
import { AuthenticatedRequest } from '../common.js';

// #region Signup

interface SignupRequestBody {
  tag: string;
  email: string;
  password: string;
}

export interface SignupRequest extends Request {
  body: SignupRequestBody;
}

// #endregion

// #region Login

interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginRequest extends Request {
  body: LoginRequestBody;
}

// #endregion

// #region Protect

export interface ProtectRequest extends AuthenticatedRequest {}

// #endregion

// #region RestrictTo

export interface RestrictToRequest extends AuthenticatedRequest {}

// #endregion

// #region ForgotPassword

interface ForgotPasswordRequestBody {
  email: string;
}

export interface ForgotPasswordRequest extends AuthenticatedRequest {
  body: ForgotPasswordRequestBody;
}

// #endregion

// #region ResetPassword

interface ResetPasswordRequestBody {
  password: string;
}

export interface ResetPasswordRequest extends AuthenticatedRequest {
  body: ResetPasswordRequestBody;
}

// #endregion

// #region UpdatePassword

interface UpdatePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordRequest extends AuthenticatedRequest {
  body: UpdatePasswordRequestBody;
}

// #endregion
