import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  // lógica fake pra teste
  const fakeChargeId = 'charge_' + Date.now();
  res.status(201).json({
    status: 'pending',
    chargeId: fakeChargeId,
    amount: req.body.amount,
  });
});

export default router;
