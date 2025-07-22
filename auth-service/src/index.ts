import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import verifyTokenRoute from './routes/verifyToken';
import * as functions from 'firebase-functions';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/verify-token', verifyTokenRoute);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

// Exporta para Firebase Functions
export const authService = functions.https.onRequest(app);

// Opcional: para rodar localmente com `npm run dev`
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Auth Service rodando na porta ${PORT}`);
  });
} 