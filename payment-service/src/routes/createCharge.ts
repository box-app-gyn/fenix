import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  // TODO: integrar com FlowPay
  // Exemplo: const { amount, userId } = req.body;
  return res.json({ success: true, message: 'Cobrança criada (mock)' });
});

export default router; 