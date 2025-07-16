# 📧 Configuração de Email no Dashboard de Marketing

## Visão Geral

O dashboard de marketing agora inclui uma nova aba **"Configuração de Email"** que permite aos profissionais de marketing configurar e gerenciar o sistema de email do Interbox 2025 de forma visual e intuitiva.

## Funcionalidades

### 🔧 Configuração de Provedores

#### Gmail
- **Email**: Campo para inserir o email Gmail
- **Senha de App**: Campo para senha de aplicativo (não senha principal)
- **Botão de Configuração**: Salva as credenciais do Gmail

#### SendGrid
- **API Key**: Campo para inserir a chave da API SendGrid
- **Email Remetente**: Campo para email remetente (ex: noreply@interbox2025.com)
- **Botão de Configuração**: Salva as credenciais do SendGrid

### 📝 Templates de Email

Visualização e edição dos templates disponíveis:
- 🎫 **Pedido Confirmado**: Email enviado após confirmação de pedido
- 📸 **Status Audiovisual**: Notificação de aprovação/rejeição
- 🎯 **Notificação Admin**: Comunicações administrativas
- 👋 **Boas-vindas**: Email de boas-vindas para novos usuários

### 🔍 Status da Configuração

Indicadores visuais do status de cada componente:
- 🟢 **Verde**: Configurado e funcionando
- 🟡 **Amarelo**: Pendente de configuração
- 🔴 **Vermelho**: Erro ou não configurado

## Como Acessar

1. Faça login com uma conta que tenha `role: 'marketing'`
2. Acesse `/marketing` no navegador
3. Clique na aba **"📧 Configuração de Email"**

## Integração com Script

O dashboard está integrado com o script `functions/scripts/setup-email.js`:

- **Botão "📖 Ver Script"**: Abre o script no GitHub para referência
- **Funcionalidade Complementar**: O dashboard oferece interface visual, o script oferece configuração via terminal

## Segurança

- **Credenciais**: As senhas e API keys são tratadas com segurança
- **Validação**: Campos obrigatórios são validados antes do envio
- **Logs**: Todas as ações são registradas no analytics

## Próximos Passos

### Implementações Futuras

1. **Integração Real**: Conectar com as funções Firebase para configuração real
2. **Teste de Email**: Adicionar botão para testar configuração
3. **Templates Dinâmicos**: Editor visual para templates
4. **Histórico**: Log de emails enviados
5. **Métricas**: Estatísticas de entrega e abertura

### Melhorias Técnicas

1. **Validação Avançada**: Verificar formato de emails e API keys
2. **Criptografia**: Criptografar credenciais sensíveis
3. **Backup**: Sistema de backup de configurações
4. **Multi-ambiente**: Suporte para dev/staging/prod

## Uso Recomendado

1. **Desenvolvimento**: Use Gmail para testes
2. **Produção**: Use SendGrid para volume alto
3. **Backup**: Configure ambos os provedores
4. **Monitoramento**: Verifique logs regularmente

## Troubleshooting

### Problemas Comuns

1. **Gmail não funciona**: Verifique se está usando senha de app
2. **SendGrid não funciona**: Verifique se a API key está correta
3. **Emails não chegam**: Verifique configurações de domínio
4. **Erro de autenticação**: Verifique se está logado no Firebase

### Logs Úteis

```bash
# Ver logs do Firebase Functions
firebase functions:log

# Testar configuração
npm run test:email

# Verificar configurações
firebase functions:config:get
```

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do script `setup-email.js`
2. Consulte os logs do Firebase
3. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido para o Interbox 2025** 🏆 