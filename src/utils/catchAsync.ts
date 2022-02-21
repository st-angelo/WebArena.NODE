import { NextFunction, Request, Response } from 'express';

export function catchAsync<TReq extends Request>(
  fn: (req: TReq, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: TReq, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
