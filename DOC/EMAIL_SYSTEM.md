# Sistema de Email - Interbox 2025

## Visão Geral

O sistema de email do Interbox 2025 é uma solução robusta e escalável para envio de emails transacionais e notificações. O sistema utiliza múltiplos provedores de email, implementa rate limiting, retry automático e templates responsivos.

## Arquitetura

### Estrutura de Arquivos

functions/src/
├── email.ts                    # Funções principais de email
├── services/
│   └── emailService.ts         # Serviço principal de email
├── config/
│   └── email.ts               # Configurações e templates
└── utils/
    └── logger.ts              # Sistema de logging

### Componentes Principais

1. **EmailService** - Classe principal que gerencia envio de emails
2. **Templates** - Sistema de templates HTML responsivos
3. **Rate Limiting** - Controle de taxa de envio
4. **Retry Logic** - Tentativas automáticas em caso de falha
5. **Validação** - Sanitização e validação de dados

## Configuração

### Variáveis de Ambiente

```bash
# Gmail
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app

# SendGrid (alternativa)
SENDGRID_API_KEY=sua-api-key
SENDGRID_FROM=noreply@interbox2025.com
```

### Firebase Functions Config

```bash
# Configurar Gmail
firebase functions:config:set email.user="seu-email@gmail.com"
firebase functions:config:set email.password="sua-senha-de-app"

# Configurar SendGrid (opcional)
firebase functions:config:set sendgrid.api_key="sua-api-key"
firebase functions:config:set sendgrid.from="noreply@interbox2025.com"
```

## Templates Disponíveis

### 1. Pedido Confirmado (`pedido`)

- **Assunto**: "Pedido Confirmado - Interbox 2025"
- **Uso**: Confirmação de pedidos de ingressos
- **Dados**: tipo, quantidade, valorTotal

### 2. Status Audiovisual (`audiovisual`)

- **Assunto**: "Status da Inscrição - Interbox 2025"
- **Uso**: Notificação de aprovação/rejeição de credenciamento
- **Dados**: aprovado, tipo, motivoRejeicao

### 3. Notificação Admin (`admin`)

- **Assunto**: "Notificação - Interbox 2025"
- **Uso**: Notificações gerais do sistema
- **Dados**: message

### 4. Boas-vindas (`boasVindas`)

- **Assunto**: "Bem-vindo ao INTERBØX 2025"
- **Uso**: Email de boas-vindas para novos usuários
- **Dados**: userName

## Funções Disponíveis

### 1. enviaEmailConfirmacao

```typescript
// Callable Function
const result = await enviaEmailConfirmacao({
  userEmail: "usuario@email.com",
  userName: "Nome do Usuário",
  tipo: "pedido" | "audiovisual" | "admin",
  dadosAdicionais: {
    // Dados específicos do tipo
  }
});
```

### 2. enviaEmailBoasVindas

```typescript
// Função interna
await enviaEmailBoasVindas({
  userEmail: "usuario@email.com",
  userName: "Nome do Usuário",
  tipo: "admin",
  dadosAdicionais: {
    message: "Bem-vindo ao INTERBØX 2025!"
  }
});
```

### 3. enviaEmailNotificacao

```typescript
// Função interna
await enviaEmailNotificacao(
  "usuario@email.com",
  "Nome do Usuário",
  "Mensagem da notificação"
);
```

## Características de Segurança

### Sanitização de Dados

- Prevenção de XSS em todos os campos de texto
- Validação de formato de email
- Limitação de tamanho de campos

### Rate Limiting

- Máximo 5 emails por minuto por usuário
- Cache em memória para controle de taxa
- Cooldown de 1 minuto entre emails

### Validação

- Regex para validação de email
- Lista de domínios permitidos (opcional)
- Limites de tamanho para assunto e corpo

## Tratamento de Erros

### Retry Automático

- Máximo 3 tentativas por email
- Delay de 5 segundos entre tentativas
- Log detalhado de cada tentativa

### Fallback de Provedores

1. **Gmail** (primário)
2. **SendGrid** (secundário)
3. **Local SMTP** (desenvolvimento)

### Logging

- Logs de sucesso com messageId
- Logs de erro com detalhes
- Logs de rate limiting
- Contexto de requisição

## Monitoramento

### Métricas Importantes

- Taxa de entrega
- Taxa de abertura
- Taxa de clique
- Tempo de entrega
- Erros por provedor

### Health Check

```typescript
const isHealthy = await emailService.checkHealth();
```

## Exemplos de Uso

### Envio de Email de Confirmação de Pedido

```typescript
// No frontend
const functions = getFunctions();
const enviaEmailConfirmacao = httpsCallable(functions, 'enviaEmailConfirmacaoFunction');

const result = await enviaEmailConfirmacao({
  userEmail: "cliente@email.com",
  userName: "João Silva",
  tipo: "pedido",
  dadosAdicionais: {
    tipo: "Ingresso Premium",
    quantidade: 2,
    valorTotal: "150,00"
  }
});
```

### Envio de Email de Status Audiovisual

```typescript
// No backend (Cloud Function)
await enviaEmailBoasVindas({
  userEmail: "fotografo@email.com",
  userName: "Maria Santos",
  tipo: "audiovisual",
  dadosAdicionais: {
    aprovado: true,
    tipo: "Fotógrafo Profissional"
  }
});
```

### Envio de Notificação

```typescript
// No backend (Cloud Function)
await enviaEmailNotificacao(
  "usuario@email.com",
  "Nome do Usuário",
  "Sua inscrição foi processada com sucesso!"
);
```

## Desenvolvimento

### Teste Local

```bash
# Instalar MailHog para testes
brew install mailhog
mailhog

# Configurar transporter de teste
# O sistema detectará automaticamente o ambiente de desenvolvimento
```

### Deploy

```bash
# Deploy das funções
firebase deploy --only functions

# Verificar logs
firebase functions:log
```

## Troubleshooting

### Problemas Comuns

1. **Email não enviado**
   - Verificar configurações do Gmail/SendGrid
   - Verificar logs de erro
   - Verificar rate limiting

2. **Template não encontrado**
   - Verificar nome do template
   - Verificar estrutura de dados

3. **Rate limit excedido**
   - Aguardar 1 minuto
   - Verificar cache de rate limiting

### Comandos Úteis

```bash
# Limpar cache de rate limiting
# (implementar função no EmailService)

# Verificar saúde do serviço
# await emailService.checkHealth()

# Verificar configurações
# functions:config:get
```

## Próximos Passos

1. **Implementar métricas** - Integração com Google Analytics
2. **Templates dinâmicos** - Sistema de templates customizáveis
3. **A/B Testing** - Teste de diferentes templates
4. **Webhooks** - Notificações de entrega
5. **Fila de emails** - Sistema de filas para alta demanda
