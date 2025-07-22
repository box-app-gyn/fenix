import express from 'express';
const router = express.Router();

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    chargeId: id,
    status: 'confirmed', // simulação
  });
});

export default router;
