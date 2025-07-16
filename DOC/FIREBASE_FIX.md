# Correção do Erro Firebase invalid-api-key

## Problema
O erro `Firebase: Error (auth/invalid-api-key)` ocorre porque o Firebase Console precisa ser configurado para autorizar o domínio localhost.

## Solução

### 1. Acesse o Firebase Console
- Vá para https://console.firebase.google.com/
- Selecione o projeto `interbox-box-app25`

### 2. Configure Autenticação
- No menu lateral, clique em "Authentication"
- Vá para a aba "Settings" (Configurações)
- Role até "Authorized domains" (Domínios autorizados)
- Clique em "Add domain" (Adicionar domínio)
- Adicione: `localhost`
- Clique em "Add" (Adicionar)

### 3. Configure Firestore
- No menu lateral, clique em "Firestore Database"
- Se não existir, clique em "Create database"
- Escolha "Start in test mode" para desenvolvimento
- Selecione a localização mais próxima (ex: us-central1)

### 4. Configure Storage
- No menu lateral, clique em "Storage"
- Se não existir, clique em "Get started"
- Escolha "Start in test mode" para desenvolvimento
- Selecione a localização mais próxima

### 5. Teste a Aplicação
- Acesse http://localhost:3001/
- Tente fazer login com Google
- Verifique se não há mais erros no console

## Configuração de Produção

Para deploy em produção, adicione também:
- Seu domínio de produção (ex: `seuapp.com`)
- Subdomínios se necessário

## Variáveis de Ambiente

O projeto está configurado para usar variáveis de ambiente. Crie um arquivo `.env` na raiz:

```env
VITE_FIREBASE_API_KEY=AIzaSyDdLZo5ZO32WOpxNgqqSQw381cekJPfVBg
VITE_FIREBASE_AUTH_DOMAIN=interbox-box-app25.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=interbox-box-app25
VITE_FIREBASE_STORAGE_BUCKET=interbox-box-app25.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1087720410628
VITE_FIREBASE_APP_ID=1:1087720410628:web:12ee7c7a6b6d987f102f51
VITE_FIREBASE_MEASUREMENT_ID=G-VRZEQPCZ55
```

## Status Atual
✅ Build funcionando
✅ Servidor rodando em http://localhost:3001/
✅ TypeScript sem erros
✅ Firebase configurado com fallback
⚠️ Necessário configurar domínios autorizados no Firebase Console 