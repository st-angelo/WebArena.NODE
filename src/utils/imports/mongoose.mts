import mongoose from 'mongoose';
export interface Model<
  T,
  TQueryHelpers = {},
  TMethodsAndOverrides = {},
  TVirtuals = {}
> extends mongoose.Model<T, TQueryHelpers, TMethodsAndOverrides, TVirtuals> {}
export class Schema<
  DocType = any,
  M = Model<DocType, any, any, any>,
  TInstanceMethods = any,
  TQueryHelpers = any
> extends mongoose.Schema<DocType, M, TInstanceMethods, TQueryHelpers> {}
export const model = mongoose.model;
export class Document<
  T = any,
  TQueryHelpers = any,
  DocType = any
> extends mongoose.Document<T, TQueryHelpers, DocType> {}
export class Query<
  ResultType,
  DocType,
  THelpers = {},
  RawDocType = DocType
> extends mongoose.Query<ResultType, DocType, THelpers, RawDocType> {}
export type ObjectId = mongoose.Types.ObjectId;
