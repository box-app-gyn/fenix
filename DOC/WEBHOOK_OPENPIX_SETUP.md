# Configuração de Webhook OpenPix com Firebase Functions

## 🎯 Problema Resolvido

Este documento descreve como configurar corretamente um webhook da OpenPix usando Firebase Functions, resolvendo o erro 403 (Forbidden) que ocorria devido a problemas de autenticação.

## ✅ Padrão que Funcionou

### 1. **Versão do Firebase Functions**
- **Usar Firebase Functions v1** em vez de v2 para webhooks públicos
- Import: `import { onRequest } from 'firebase-functions/v1/https';`

### 2. **Configuração da Função**
```typescript
export const webhookOpenPix = onRequest(async (request, response) => {
  // Configuração CORS simples e robusta
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', '*');
  response.set('Access-Control-Allow-Headers', '*');

  // Log detalhado para debug
  console.log("🔍 Webhook OpenPix - Dados completos recebidos:", {
    event: webhookData?.event,
    correlationId: webhookData?.correlationID,
    webhookData: webhookData,
    headers: request.headers,
  });

  // Aceitar tanto GET quanto POST
  let webhookData;
  
  if (request.method === 'GET') {
    webhookData = {
      event: request.query.event as string,
      correlationID: request.query.correlationID as string,
      status: request.query.status as string,
      data_criacao: request.query.data_criacao as string,
      evento: request.query.evento as string,
      ...request.query
    };
  } else if (request.method === 'POST') {
    webhookData = request.body;
  } else {
    response.status(200).send({ success: true, message: 'Method not supported but accepted' });
    return;
  }

  // Processar eventos
  switch (webhookData.event) {
    case 'CHARGE_CONFIRMED':
    case 'OPENPIX:CHARGE_COMPLETED':
      await processPaymentSuccess(webhookData);
      break;
    case 'CHARGE_EXPIRED':
    case 'OPENPIX:CHARGE_EXPIRED':
      await processPaymentExpired(webhookData);
      break;
    default:
      console.log("Evento não processado", { event: webhookData.event });
  }

  // Sempre retornar 200
  response.status(200).send({ success: true });
});
```

### 3. **URL da Função**
- **URL correta**: `https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookOpenPix`
- **Formato**: `https://us-central1-{PROJECT_ID}.cloudfunctions.net/{FUNCTION_NAME}`

### 4. **Configuração na OpenPix**
- **URL do Webhook**: `https://us-central1-interbox-app-8d400.cloudfunctions.net/webhookOpenPix`
- **Evento**: `Cobrança paga - OPENPIX:CHARGE_COMPLETED`
- **Cabeçalhos HTTP**: Deixar vazios (opcional)

## 🚫 Problemas que Causavam Erro 403

### 1. **Firebase Functions v2**
- ❌ `import { onRequest } from 'firebase-functions/v2/https';`
- ❌ Configuração `invoker: 'public'` não funcionava
- ❌ URL: `https://webhookopenpix-gutjsyhc4q-uc.a.run.app`

### 2. **Configuração CORS Complexa**
- ❌ Headers específicos causavam conflitos
- ❌ Middleware CORS automático

### 3. **Autenticação**
- ❌ Função exigia autenticação
- ❌ OpenPix não enviava tokens

## ✅ Soluções Aplicadas

### 1. **Migração para v1**
```typescript
// ❌ Não funcionava
import { onRequest } from 'firebase-functions/v2/https';

// ✅ Funcionou
import { onRequest } from 'firebase-functions/v1/https';
```

### 2. **CORS Simplificado**
```typescript
// ✅ Configuração que funcionou
response.set('Access-Control-Allow-Origin', '*');
response.set('Access-Control-Allow-Methods', '*');
response.set('Access-Control-Allow-Headers', '*');
```

### 3. **URL Correta**
- ✅ Firebase Functions v1 gera URLs no formato correto
- ✅ Não requer configuração adicional de autenticação

## 🔧 Comandos para Deploy

```bash
# Deletar função antiga (se necessário)
firebase functions:delete webhookOpenPix --force

# Deploy da função
firebase deploy --only functions:webhookOpenPix

# Deploy completo
firebase deploy --only functions
```

## 📋 Checklist de Verificação

- [ ] Função usa Firebase Functions v1
- [ ] CORS configurado com `*`
- [ ] URL no formato correto
- [ ] Logs detalhados implementados
- [ ] Retorna status 200 sempre
- [ ] Aceita GET e POST
- [ ] Processa eventos OpenPix corretamente

## 🎉 Resultado Final

- ✅ Webhook recebe eventos da OpenPix
- ✅ Retorna status 200 (sucesso)
- ✅ Logs detalhados para debug
- ✅ Processamento automático de pagamentos
- ✅ Sistema pronto para produção

## 📝 Notas Importantes

1. **Firebase Functions v1** é mais adequado para webhooks públicos
2. **URLs v1** são mais simples e confiáveis
3. **CORS permissivo** evita problemas de cross-origin
4. **Logs detalhados** são essenciais para debug
5. **Sempre retornar 200** para não quebrar o webhook

---

**Data**: 18/07/2025  
**Status**: ✅ Funcionando  
**Versão**: 1.0 