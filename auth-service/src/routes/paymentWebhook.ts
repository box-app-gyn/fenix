import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  console.log('💥 Webhook recebido:', req.body);
  res.status(200).json({ received: true });
});

export default router;
