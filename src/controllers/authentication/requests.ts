import { Request } from 'express';
// TODO rethink requests
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

export interface ProtectRequest extends Request {}

// #endregion

// #region RestrictTo

export interface RestrictToRequest extends Request {}

// #endregion

// #region ForgotPassword

interface ForgotPasswordRequestBody {
  email: string;
}

export interface ForgotPasswordRequest extends Request {
  body: ForgotPasswordRequestBody;
}

// #endregion

// #region ResetPassword

interface ResetPasswordRequestBody {
  password: string;
}

export interface ResetPasswordRequest extends Request {
  body: ResetPasswordRequestBody;
}

// #endregion

// #region UpdatePassword

interface UpdatePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordRequest extends Request {
  body: UpdatePasswordRequestBody;
}

// #endregion
