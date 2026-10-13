import { createHmac, timingSafeEqual } from 'node:crypto';
import User from '../models/User.js';

const secret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return process.env.JWT_SECRET;
};

export function signToken(userId) {
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const payload = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: userId, iat: now, exp: now + 60 * 60 * 24 })}`;
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const [header, payload, signature, extra] = token.split('.');
    if (!header || !payload || !signature || extra) throw new Error('Invalid token');
    const expected = createHmac('sha256', secret()).update(`${header}.${payload}`).digest();
    const received = Buffer.from(signature, 'base64url');
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) throw new Error('Invalid token');
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (JSON.parse(Buffer.from(header, 'base64url').toString('utf8')).alg !== 'HS256') throw new Error('Invalid token');
    if (!claims.sub || !Number.isFinite(claims.exp) || claims.exp <= Date.now() / 1000) throw new Error('Expired token');
    const user = await User.findById(claims.sub).select('_id email');
    if (!user) throw new Error('User not found');
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
