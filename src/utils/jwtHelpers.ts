import jwt, { JwtPayload, Secret, VerifyOptions } from 'jsonwebtoken';

export const verifyJWT = (
  token: string,
  secret: Secret,
  options?: VerifyOptions
): Promise<JwtPayload> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, secret, options, (err, result) =>
      err ? reject(err) : resolve(result as JwtPayload)
    )
  );
