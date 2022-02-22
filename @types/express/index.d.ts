declare namespace Express {
  interface Request {
    user?: import('../../src/data/entities/user').default;
  }
}
