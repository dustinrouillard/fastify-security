import { verify, sign, decode, SignOptions } from 'jsonwebtoken';

export function GenerateToken(payload: any, options: { secret?: string; } & Partial<SignOptions>): string {
  if (!options.secret) options.secret = process.env.INTERNAL_SECRET || 'secret';

  const secret = options.secret;
  delete options.secret;

  // Sign and return the JWT
  return sign(payload, secret, options);
}

export function DecodeAndVerifyToken<T>(token: string, options: { secret?: string; } & Partial<SignOptions>): T | null | { [key: string]: any } | object | string | boolean {
  if (!options.secret) options.secret = process.env.INTERNAL_SECRET || 'secret';

  // Verify the incoming token against our secret
  let tokenVerify = verify(token, options.secret, { issuer: options.issuer, subject: options.subject });
  if (!tokenVerify) return false;

  // Decode and return the results
  let tokenDecode = decode(token);

  return tokenDecode || tokenVerify;
}
