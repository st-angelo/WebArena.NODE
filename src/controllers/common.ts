import { Request } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export interface TypedRequest<
  TReqBody = any,
  TQuery = Query,
  TParams = ParamsDictionary
> extends Request<TParams, any, TReqBody, TQuery> {
  body: TReqBody;
  query: TQuery;
  params: TParams;
}
