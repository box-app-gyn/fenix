# 🔗 Integração FlowPay - Inscrições Audiovisuais

## 📋 Visão Geral

Este documento descreve a integração completa com a FlowPay para processar pagamentos de inscrições audiovisuais no valor de **R$ 29,90**.

## 🎯 Funcionalidades Implementadas

### ✅ Checkout FlowPay
- Criação automática de checkout ao enviar formulário
- Valor fixo de R$ 29,90
- Redirecionamento seguro para pagamento
- Modal de confirmação antes do pagamento

### ✅ Webhook de Processamento
- Processamento automático de retornos da FlowPay
- Confirmação de inscrição após pagamento aprovado
- Tratamento de pagamentos cancelados/expirados
- Envio de email de confirmação

### ✅ Página de Sucesso
- Confirmação visual do pagamento
- Detalhes da transação
- Próximos passos para o usuário
- Navegação para outras áreas do app

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis no Firebase Functions:

```bash
# Configuração da FlowPay
firebase functions:config:set flowpay.api_key="sua_api_key_aqui"
firebase functions:config:set flowpay.webhook_secret="seu_webhook_secret_aqui"

# URL do App
firebase functions:config:set app.url="https://interbox-app-8d400.web.app"
```

### 2. Webhook URL

Configure o webhook na FlowPay para apontar para:
```
https://sua-regiao-sua-projeto.cloudfunctions.net/webhookFlowPay
```

### 3. URL de Redirecionamento

A URL de redirecionamento após pagamento é:
```
https://interbox-app-8d400.web.app/interbox/audiovisual/confirmacao
```

## 📁 Estrutura de Arquivos

### Backend (Functions)
```
functions/
├── audiovisual-inscricao.js          # Funções principais
│   ├── criarCheckoutFlowPay()        # Cria checkout
│   ├── webhookFlowPay()              # Processa webhooks
│   ├── processPaymentSuccess()       # Pagamento aprovado
│   ├── processPaymentCancelled()     # Pagamento cancelado
│   └── processPaymentExpired()       # Pagamento expirado
```

### Frontend (Pages)
```
src/pages/audiovisual/
├── form.tsx                          # Formulário com checkout
└── success.tsx                       # Página de confirmação
```

### Rotas
```
/interbox/audiovisual/confirmacao     # Página de confirmação após pagamento
```

## 🔄 Fluxo de Pagamento

### 1. Envio do Formulário
```typescript
// Usuário preenche formulário
const checkoutPayload = {
  userEmail: "usuario@email.com",
  userName: "Nome do Usuário",
  telefone: "(11) 99999-9999",
  tipo: "fotografo",
  // ... outros dados
};

// Chama função para criar checkout
const result = await criarCheckoutFlowPay(checkoutPayload);
```

### 2. Criação do Checkout
```javascript
// Configuração da FlowPay
const flowpayConfig = {
  amount: 2990, // R$ 29,90 em centavos
  currency: "BRL",
  description: "Inscrição Audiovisual - CERRADO INTERBØX 2025",
  externalId: `audiovisual_${Date.now()}_${userId}`,
  customer: {
    name: data.userName,
    email: data.userEmail,
    phone: data.telefone
  },
  items: [{
    name: "Inscrição Audiovisual",
    description: `Candidatura para ${data.tipo} - CERRADO INTERBØX 2025`,
    quantity: 1,
    unitAmount: 2990
  }],
  redirectUrl: "https://interbox-app-8d400.web.app/interbox/audiovisual/confirmacao",
  webhookUrl: "https://interbox-app-8d400.web.app/api/webhooks/flowpay"
};
```

### 3. Processamento do Webhook
```javascript
// Eventos processados
switch (webhookData.event) {
  case 'order.paid':
    await processPaymentSuccess(webhookData);
    break;
  case 'order.cancelled':
    await processPaymentCancelled(webhookData);
    break;
  case 'order.expired':
    await processPaymentExpired(webhookData);
    break;
}
```

## 📊 Estrutura de Dados

### Collection: `audiovisual_checkouts`
```javascript
{
  userId: "user_id",
  userEmail: "usuario@email.com",
  userName: "Nome do Usuário",
  flowpayOrderId: "flowpay_order_id",
  externalId: "audiovisual_timestamp_userid",
  amount: 2990,
  status: "pending" | "paid" | "cancelled" | "expired",
  audiovisualData: {
    // Dados completos do formulário
  },
  checkoutUrl: "https://checkout.flowpay.com.br/...",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  paidAt: Timestamp, // Apenas quando pago
  paymentData: {} // Dados do webhook
}
```

### Collection: `audiovisual` (após pagamento)
```javascript
{
  userId: "user_id",
  userEmail: "usuario@email.com",
  userName: "Nome do Usuário",
  tipo: "fotografo",
  experiencia: "...",
  portfolio: "...",
  telefone: "...",
  status: "pending",
  payment: {
    status: "paid",
    flowpayOrderId: "flowpay_order_id",
    amount: 2990,
    paidAt: Timestamp
  },
  checkoutId: "checkout_document_id",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🎨 Interface do Usuário

### Modal de Pagamento
- ✅ Confirmação visual do valor (R$ 29,90)
- ✅ Botão "Pagar com Segurança"
- ✅ Opção de cancelamento
- ✅ Redirecionamento para FlowPay

### Página de Confirmação
- ✅ Confirmação do pagamento
- ✅ Detalhes da transação
- ✅ Próximos passos
- ✅ Navegação para outras áreas
- ✅ URL: `/interbox/audiovisual/confirmacao`

## 🔒 Segurança

### Validações Implementadas
- ✅ Autenticação obrigatória
- ✅ Validação de dados do formulário
- ✅ Verificação de inscrição duplicada
- ✅ Verificação de assinatura do webhook (opcional)

### Logs e Monitoramento
- ✅ Logs de segurança para tentativas não autenticadas
- ✅ Logs de negócio para transações
- ✅ Logs de erro para troubleshooting
- ✅ Rastreamento de analytics

## 📧 Email de Confirmação

Após pagamento aprovado, o sistema envia email com:
- ✅ Confirmação da inscrição
- ✅ Detalhes do pagamento
- ✅ Próximos passos
- ✅ Contato para dúvidas

## 🚀 Deploy

### 1. Deploy das Functions
```bash
cd functions
npm run build
firebase deploy --only functions
```

### 2. Configuração da FlowPay
1. Acesse o painel da FlowPay
2. Configure o webhook URL
3. Adicione a API key nas variáveis de ambiente
4. Teste com pagamento de desenvolvimento

### 3. Teste da Integração
1. Preencha formulário audiovisual
2. Verifique criação do checkout
3. Complete pagamento de teste
4. Confirme redirecionamento para `/interbox/audiovisual/confirmacao`
5. Verifique processamento do webhook
6. Confirme criação da inscrição

## 🐛 Troubleshooting

### Problemas Comuns

#### Checkout não criado
- Verificar API key da FlowPay
- Verificar logs de erro
- Validar dados do formulário

#### Webhook não processado
- Verificar URL do webhook
- Verificar logs da função
- Validar formato dos dados

#### Inscrição não criada
- Verificar processamento do webhook
- Verificar logs de transação
- Validar dados do usuário

### Logs Importantes
```javascript
// Logs de negócio
logger.business("Checkout FlowPay criado", {
  checkoutId: checkoutRef.id,
  flowpayOrderId: checkoutData.id,
  userEmail: data.userEmail,
  amount: flowpayConfig.amount
});

// Logs de erro
logger.error("Erro ao criar checkout FlowPay", {
  error: error.message,
  userEmail: data.userEmail
});
```

## 📈 Analytics

### Eventos Rastreados
- `formulario_audiovisual_checkout` - Formulário enviado
- `checkout_created` - Checkout criado
- `checkout_redirected` - Redirecionamento para pagamento
- `payment_success` - Pagamento confirmado
- `form_error` - Erros no formulário

## 🔄 Próximas Melhorias

### Funcionalidades Planejadas
- [ ] Comprovante de pagamento em PDF
- [ ] Notificações push para confirmação
- [ ] Dashboard de pagamentos para admin
- [ ] Relatórios de conversão
- [ ] Integração com sistema de gamificação

### Otimizações
- [ ] Cache de configurações da FlowPay
- [ ] Retry automático para webhooks falhados
- [ ] Validação de assinatura do webhook
- [ ] Rate limiting para criação de checkouts

---

**CERRADO INTERBØX 2025** 🏆  
**Integração FlowPay Completa** 💳 