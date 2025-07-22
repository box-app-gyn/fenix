import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  // TODO: integrar com FlowPay
  // Exemplo: const { id } = req.query;
  return res.json({ success: true, status: 'pending', message: 'Status mock' });
});

export default router; 