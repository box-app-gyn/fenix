import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  // TODO: processar webhook FlowPay
  // Exemplo: const event = req.body;
  return res.json({ received: true });
});

export default router; 