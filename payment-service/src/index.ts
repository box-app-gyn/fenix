import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import createChargeRoute from './routes/createCharge';
import verifyChargeRoute from './routes/verifyCharge';
import paymentWebhookRoute from './routes/paymentWebhook';
import * as functions from 'firebase-functions';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/create-charge', createChargeRoute);
app.use('/verify-charge', verifyChargeRoute);
app.use('/payment-webhook', paymentWebhookRoute);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

// Exporta para Firebase Functions
export const paymentService = functions.https.onRequest(app);

// Opcional: para rodar localmente com `npm run dev`
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Payment Service rodando na porta ${PORT}`);
  });
} 