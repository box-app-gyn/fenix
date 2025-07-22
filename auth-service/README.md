# Auth Service

Microserviço responsável por autenticação, perfis e permissões.

## Endpoints
- `POST /verify-token` — Valida JWT do Firebase e retorna claims.
- `GET /health` — Healthcheck.

## Variáveis de ambiente
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `JWT_SECRET`
- `PORT`

## Uso
```
npm install
npm run dev
``` 