import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import express from 'express';
import User from '../models/User.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = express.Router();
const scrypt = promisify(scryptCallback);

async function hashPassword(password, salt) {
  return (await scrypt(password, salt, 64)).toString('hex');
}

router.post('/register', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = req.body.password;
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address' });
  if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  try {
    const passwordSalt = randomBytes(16).toString('hex');
    const passwordHash = await hashPassword(password, passwordSalt);
    const user = await User.create({ email, passwordSalt, passwordHash });
    return res.status(201).json({ token: signToken(user.id), user: { id: user.id, email: user.email } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'An account with this email already exists' });
    console.error('Registration failed:', error);
    return res.status(500).json({ error: 'Could not create account' });
  }
});

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = req.body.password;
  if (typeof password !== 'string') return res.status(400).json({ error: 'Email and password are required' });
  try {
    const user = await User.findOne({ email }).select('+passwordHash +passwordSalt');
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const candidate = Buffer.from(await hashPassword(password, user.passwordSalt), 'hex');
    const stored = Buffer.from(user.passwordHash, 'hex');
    if (candidate.length !== stored.length || !timingSafeEqual(candidate, stored)) return res.status(401).json({ error: 'Invalid email or password' });
    return res.json({ token: signToken(user.id), user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'Could not log in' });
  }
});

router.get('/me', requireAuth, (req, res) => res.json({ user: { id: req.user.id, email: req.user.email } }));
router.post('/logout', requireAuth, (_req, res) => res.json({ success: true }));

export default router;
