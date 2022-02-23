// #region Signup

export interface SignupBody {
  tag: string;
  email: string;
  password: string;
}

// #endregion

// #region Login

export interface LoginBody {
  email: string;
  password: string;
}

// #endregion

// #region Protect

// #endregion

// #region RestrictTo

// #endregion

// #region ForgotPassword

export interface ForgotPasswordBody {
  email: string;
}

// #endregion

// #region ResetPassword

export interface ResetPasswordBody {
  password: string;
}

// #endregion

// #region UpdatePassword

export interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

// #endregion
