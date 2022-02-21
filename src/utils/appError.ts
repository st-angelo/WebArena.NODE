// TODO implement my custom error
export class AppError extends Error {
  statusCode: number | string;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number | string) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
