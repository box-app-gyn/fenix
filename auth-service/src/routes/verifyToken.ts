import { Router } from 'express';
import admin from 'firebase-admin';

const router = Router();

router.post('/', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token ausente' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return res.json({ valid: true, uid: decoded.uid, claims: decoded });
  } catch (e) {
    return res.status(401).json({ valid: false, error: 'Token inválido' });
  }
});

export default router; 