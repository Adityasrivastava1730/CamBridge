import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Session from '../models/Session.js';

const router = Router();

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const session = await Session.create({ code, host: req.userId });
    res.status(201).json({ code, sessionId: session._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/status/:code', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOne({ code: req.params.code });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ status: session.status, host: session.host });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
