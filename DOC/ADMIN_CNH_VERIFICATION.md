# 🔐 Verificação de CNH para Admins - CERRADØ INTERBOX 2025

## 📋 Visão Geral

Sistema de verificação de identidade obrigatória para admins específicos no primeiro acesso, garantindo segurança e conformidade.

## 🎯 Admins que Precisam de Verificação

### **Emails Obrigatórios:**
- `avanticrossfit@gmail.com`
- `gopersonal82@gmail.com`

### **Condições:**
- ✅ Usuário com role `admin` ou `dev`
- ✅ Primeiro acesso (sem `adminVerification.completedAt`)
- ✅ Email na lista de verificação obrigatória

## 🔄 Fluxo de Verificação

### 1. **Primeiro Acesso do Admin**
```
Login → Verificação de Email → CNH Upload → Acesso Liberado
```

### 2. **Componente CNHUpload**
- Interface moderna e responsiva
- Upload de frente e verso da CNH
- Validação de arquivos (imagens, máximo 5MB)
- Preview das imagens
- Upload seguro para Firebase Storage

### 3. **Armazenamento Seguro**
- **Localização**: `cnh/{userId}/frente_{timestamp}` e `cnh/{userId}/verso_{timestamp}`
- **Segurança**: Apenas admins podem visualizar
- **Validação**: Apenas imagens, máximo 5MB

## 📊 Estrutura de Dados

### **Collection: `users`**
```javascript
{
  // ... outros campos do usuário
  adminVerification: {
    required: boolean,        // Se precisa de verificação
    cnh: {
      frente: string,         // URL da imagem da frente
      verso: string,          // URL da imagem do verso
      uploadedAt: Timestamp,  // Data do upload
      status: 'pending' | 'approved' | 'rejected'
    },
    completedAt: Timestamp    // Data de conclusão
  }
}
```

## 🔧 Configuração

### 1. **Firebase Storage Rules**
```javascript
// storage.rules
match /cnh/{userId}/{fileName} {
  allow write: if request.auth != null 
    && request.auth.uid == userId
    && request.resource.size < 5 * 1024 * 1024
    && request.resource.contentType.matches('image/.*');
  
  allow read: if request.auth != null 
    && (request.auth.token.admin == true || request.auth.token.dev == true);
}
```

### 2. **Deploy das Regras**
```bash
firebase deploy --only storage
```

## 🎨 Interface do Usuário

### **CNHUpload Component**
- ✅ **Design moderno** com gradientes da marca
- ✅ **Upload drag & drop** para frente e verso
- ✅ **Preview das imagens** antes do envio
- ✅ **Validação em tempo real** (tipo, tamanho)
- ✅ **Feedback visual** (loading, sucesso, erro)
- ✅ **Responsivo** para mobile e desktop

### **Funcionalidades**
- **Validação de arquivos**: Apenas JPG/PNG, máximo 5MB
- **Preview**: Visualização antes do envio
- **Remoção**: Botão para remover e re-selecionar
- **Progresso**: Indicador de upload
- **Segurança**: Informações sobre privacidade

## 🔒 Segurança

### **Proteções Implementadas**
- ✅ **Autenticação obrigatória** para upload
- ✅ **Validação de propriedade** (usuário só pode fazer upload para si)
- ✅ **Limite de tamanho** (5MB por arquivo)
- ✅ **Validação de tipo** (apenas imagens)
- ✅ **Acesso restrito** (apenas admins podem visualizar)
- ✅ **Armazenamento seguro** no Firebase Storage

### **Privacidade**
- ✅ **Informações claras** sobre uso dos dados
- ✅ **Acesso restrito** apenas para admins autorizados
- ✅ **Possibilidade de remoção** dos dados
- ✅ **Uso específico** para verificação de identidade

## 🚀 Deploy

### 1. **Deploy das Regras de Storage**
```bash
firebase deploy --only storage
```

### 2. **Deploy do App**
```bash
npm run build
firebase deploy --only hosting
```

### 3. **Verificação**
1. Acesse com um dos emails obrigatórios
2. Verifique se aparece a tela de upload de CNH
3. Teste o upload de imagens
4. Confirme que o acesso é liberado após upload

## 🐛 Troubleshooting

### **Problemas Comuns**

#### Upload não funciona
- Verificar regras do Firebase Storage
- Verificar tamanho do arquivo (máximo 5MB)
- Verificar tipo do arquivo (apenas imagens)

#### Tela não aparece
- Verificar se o email está na lista
- Verificar se o usuário tem role admin/dev
- Verificar se já não foi verificado antes

#### Erro de permissão
- Verificar se as regras foram deployadas
- Verificar se o usuário está autenticado
- Verificar se o userId está correto

### **Logs Importantes**
```javascript
// Logs de verificação
console.log('🔐 Verificação de CNH necessária:', user.email);
console.log('✅ CNH enviada com sucesso');
console.log('❌ Erro ao enviar CNH:', error);
```

## 📈 Analytics

### **Eventos Rastreados**
- `cnh_upload_started` - Início do upload
- `cnh_upload_completed` - Upload concluído
- `cnh_upload_error` - Erro no upload
- `cnh_verification_required` - Verificação solicitada

## 🔄 Próximas Melhorias

### **Funcionalidades Planejadas**
- [ ] **OCR automático** para extrair dados da CNH
- [ ] **Verificação manual** por super admin
- [ ] **Notificações** para admins sobre status
- [ ] **Histórico** de verificações
- [ ] **Renovação** automática de verificação

### **Segurança Adicional**
- [ ] **Criptografia** das imagens
- [ ] **Expiração** automática de arquivos antigos
- [ ] **Auditoria** de acessos às imagens
- [ ] **Backup** seguro das verificações

---

**CERRADØ INTERBOX 2025** 🏆  
**Sistema de Verificação Seguro** 🔐 