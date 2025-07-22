# Payment Service

Microserviço responsável por cobranças e pagamentos (FlowPay).

## Endpoints
- `POST /create-charge` — Cria cobrança FlowPay.
- `GET /verify-charge` — Verifica status de cobrança.
- `POST /payment-webhook` — Recebe notificações FlowPay.
- `GET /health` — Healthcheck.

## Variáveis de ambiente
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FLOWPAY_API_KEY`
- `FLOWPAY_WEBHOOK_SECRET`
- `PORT`

## Uso
```
npm install
npm run dev
``` 