# 📧 Configuração do Sistema de Email em Produção

## 🎯 Visão Geral

Este guia explica como configurar o sistema de email do Interbox 2025 para funcionar em produção, incluindo templates personalizados e integração com diferentes provedores de email.

## 🚀 Opções de Provedores

### 1. **Gmail (Recomendado para Testes)**
- ✅ Fácil configuração
- ✅ Gratuito (até 500 emails/dia)
- ✅ Bom para testes e desenvolvimento

**Configuração:**
1. Ative autenticação de 2 fatores na conta Google
2. Gere uma "Senha de App" específica
3. Use essa senha no lugar da senha normal

### 2. **SendGrid (Recomendado para Produção)**
- ✅ Confiável e escalável
- ✅ 100 emails/dia gratuitos
- ✅ Analytics e relatórios
- ✅ Templates avançados

**Configuração:**
1. Crie conta em [sendgrid.com](https://sendgrid.com)
2. Gere uma API Key
3. Configure domínio verificado
4. Configure remetente verificado

### 3. **Resend (Alternativa Moderna)**
- ✅ API moderna e simples
- ✅ 100 emails/dia gratuitos
- ✅ Excelente deliverability
- ✅ Templates React

**Configuração:**
1. Crie conta em [resend.com](https://resend.com)
2. Gere uma API Key
3. Configure domínio
4. Configure remetente

## 🔧 Configuração Automática

### Usando o Script Automático

```bash
# Execute o script de configuração
node functions/scripts/setup-email-production.js
```

O script irá:
1. ✅ Verificar Firebase CLI
2. ✅ Escolher provedor de email
3. ✅ Configurar variáveis de ambiente
4. ✅ Fazer deploy das functions
5. ✅ Testar o sistema

### Configuração Manual

#### 1. Configurar Variáveis de Ambiente

```bash
# Para Gmail
firebase functions:config:set email.user="seu-email@gmail.com"
firebase functions:config:set email.password="sua-senha-de-app"

# Para SendGrid
firebase functions:config:set sendgrid.api_key="sua-api-key"
firebase functions:config:set sendgrid.from="noreply@seudominio.com"

# Para Resend
firebase functions:config:set resend.api_key="sua-api-key"
firebase functions:config:set resend.from="noreply@seudominio.com"

# URL do App
firebase functions:config:set app.url="https://interbox-app-8d400.web.app"

# FlowPay (se necessário)
firebase functions:config:set flowpay.api_key="sua-api-key"
```

#### 2. Deploy das Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

#### 3. Verificar Configuração

```bash
# Ver configurações atuais
firebase functions:config:get

# Ver logs em tempo real
firebase functions:log --only webhookFlowPay
```

## 📧 Templates de Email Disponíveis

### 1. **Confirmação de Inscrição Audiovisual**
- **Trigger:** Pagamento confirmado via FlowPay
- **Assunto:** "Inscrição Audiovisual Confirmada - CERRADO INTERBØX 2025"
- **Conteúdo:** Confirmação, detalhes do pagamento, próximos passos

### 2. **Status de Aprovação Audiovisual**
- **Trigger:** Admin aprova/rejeita inscrição
- **Assunto:** "Status da Inscrição - Interbox 2025"
- **Conteúdo:** Status da aprovação, feedback, instruções

### 3. **Email de Boas-vindas**
- **Trigger:** Novo usuário se registra
- **Assunto:** "Bem-vindo ao INTERBØX 2025"
- **Conteúdo:** Boas-vindas, próximos passos, recursos

### 4. **Notificações Administrativas**
- **Trigger:** Eventos importantes do sistema
- **Assunto:** "Notificação -  INTERBØX 2025"
- **Conteúdo:** Alertas, atualizações, informações importantes

## 🎨 Personalização de Templates

### Estrutura do Template

```typescript
// Template base
base: (content: string, title: string) => `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      /* CSS personalizado */
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎯 Interbox 2025</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>Este é um email automático, não responda a esta mensagem.</p>
        <p>© 2025 Interbox. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
  </html>
`
```

### Adicionar Novo Template

```typescript
// Em functions/src/config/email.ts
export const emailTemplates = {
  // ... templates existentes ...
  
  // Novo template
  meuTemplate: (data: any) => {
    const content = `
      <h2>Meu Template Personalizado</h2>
      <p>Olá ${data.userName},</p>
      <p>Conteúdo personalizado aqui...</p>
    `;
    
    return emailTemplates.base(content, "Meu Template - Interbox 2025");
  }
};
```

## 🔍 Monitoramento e Logs

### Verificar Logs

```bash
# Logs em tempo real
firebase functions:log --only webhookFlowPay

# Logs específicos de email
firebase functions:log --only sendEmail

# Logs de erro
firebase functions:log --only webhookFlowPay --level error
```

### Métricas Importantes

- **Taxa de entrega:** % de emails entregues
- **Taxa de abertura:** % de emails abertos
- **Taxa de clique:** % de cliques em links
- **Taxa de bounce:** % de emails retornados
- **Tempo de entrega:** Tempo médio de entrega

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. **Email não enviado**
```bash
# Verificar configuração
firebase functions:config:get

# Verificar logs
firebase functions:log --only webhookFlowPay
```

#### 2. **Erro de autenticação**
- Verificar credenciais do provedor
- Verificar se a API key está correta
- Verificar se o domínio está verificado

#### 3. **Email não chega na caixa de entrada**
- Verificar pasta de spam
- Verificar configuração de DNS
- Verificar reputação do domínio

#### 4. **Template não renderiza**
- Verificar sintaxe do template
- Verificar dados passados
- Verificar encoding UTF-8

### Comandos de Debug

```bash
# Testar configuração
firebase functions:config:get

# Redeploy das functions
firebase deploy --only functions

# Ver logs detalhados
firebase functions:log --only webhookFlowPay --level debug

# Testar webhook localmente
curl -X POST http://localhost:5001/interbox-app-8d400/us-central1/webhookFlowPay \
  -H "Content-Type: application/json" \
  -d '{"event":"CHARGE_COMPLETED","id":"test"}'
```

## 📊 Analytics e Relatórios

### SendGrid Analytics
- Dashboard com métricas detalhadas
- Relatórios de entrega
- Análise de engajamento
- Alertas de bounce

### Resend Analytics
- Métricas em tempo real
- Relatórios de performance
- Análise de domínios
- Logs detalhados

### Firebase Analytics
- Eventos de email enviado
- Conversões de email
- Funnel de inscrição
- ROI de campanhas

## 🔒 Segurança

### Boas Práticas

1. **API Keys Seguras**
   - Nunca commite API keys no código
   - Use variáveis de ambiente
   - Rotacione keys regularmente

2. **Validação de Email**
   - Valide formato de email
   - Verifique domínio
   - Implemente rate limiting

3. **Templates Seguros**
   - Sanitize dados de entrada
   - Escape HTML
   - Valide URLs

4. **Monitoramento**
   - Monitore logs de erro
   - Configure alertas
   - Acompanhe métricas

## 📝 Checklist de Produção

### ✅ Configuração
- [ ] Provedor de email escolhido e configurado
- [ ] API keys configuradas no Firebase
- [ ] Domínio verificado
- [ ] Remetente configurado
- [ ] Templates testados

### ✅ Deploy
- [ ] Functions compiladas sem erros
- [ ] Deploy realizado com sucesso
- [ ] Configurações aplicadas
- [ ] Logs funcionando

### ✅ Testes
- [ ] Email de teste enviado
- [ ] Template renderiza corretamente
- [ ] Links funcionam
- [ ] Responsivo em mobile
- [ ] Entrega na caixa principal

### ✅ Monitoramento
- [ ] Logs configurados
- [ ] Alertas ativos
- [ ] Métricas sendo coletadas
- [ ] Dashboard configurado

## 🎯 Próximos Passos

1. **Configure o provedor de email** usando o script automático
2. **Teste o fluxo completo** de inscrição audiovisual
3. **Monitore os logs** para garantir funcionamento
4. **Personalize templates** conforme necessário
5. **Configure alertas** para problemas
6. **Analise métricas** para otimização

---

**CERRADO INTERBØX 2025** 🏆  
**Sistema de Email Configurado** 📧 