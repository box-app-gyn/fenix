# Sistema de Encurtamento de Links - App Fenix

## 🎯 Visão Geral

O sistema de encurtamento de links do App Fenix permite criar URLs curtas e acompanhar estatísticas detalhadas de cliques em tempo real. Desenvolvido com TypeScript, React, Firebase e integrado ao ecossistema do CERRADO INTERBØX 2025.

## ✨ Funcionalidades

### ✅ Criação de Links

- **URLs curtas**: Transforma URLs longas em links curtos e memoráveis
- **Códigos customizados**: Permite definir códigos personalizados
- **Categorização**: Organiza links por categoria (evento, ingresso, comunidade, etc.)
- **Validação robusta**: Valida URLs, códigos e dados de entrada
- **Sanitização**: Remove caracteres perigosos e limita tamanhos

### ✅ Gerenciamento

- **Dashboard completo**: Interface para gerenciar todos os links
- **Edição em tempo real**: Modifica títulos, descrições e categorias
- **Ativação/desativação**: Controle de status dos links
- **Exclusão segura**: Remove links com confirmação

### ✅ Analytics Avançados

- **Contadores de cliques**: Total e por período
- **Dispositivos**: Desktop, mobile, tablet
- **Geolocalização**: País de origem dos cliques
- **Horários**: Distribuição por hora do dia
- **Datas**: Evolução temporal dos cliques

### ✅ Redirecionamento Inteligente

- **Página de preview**: Mostra informações antes do redirecionamento
- **Registro automático**: Conta cliques automaticamente
- **Detecção de dispositivo**: Identifica tipo de dispositivo
- **Tratamento de erros**: Links inválidos ou expirados

## 🛠️ Arquitetura

### Tipos TypeScript (`src/types/linkShortener.ts`)

```typescript
interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title?: string;
  description?: string;
  category?: 'evento' | 'ingresso' | 'comunidade' | 'midia' | 'admin' | 'outro';
  isActive: boolean;
  clickCount: number;
  analytics: {
    totalClicks: number;
    clicksByDate: Record<string, number>;
    clicksByDevice: Record<string, number>;
    clicksByCountry: Record<string, number>;
  };
}
```

### Hook Principal (`src/hooks/useLinkShortener.ts`)

- **CRUD completo**: Criar, ler, atualizar, deletar links
- **Tempo real**: Atualizações automáticas via Firestore
- **Validação**: Verifica dados antes de salvar
- **Analytics**: Calcula estatísticas automaticamente

### Componentes React

- **LinkShortener**: Interface principal de gerenciamento
- **LinkRedirect**: Página de redirecionamento
- **InitialLinkCreator**: Ferramenta administrativa

## 🚀 Como Usar

### 1. Acessar o Sistema

```
URL: /links
Requer: Login com Google
```

### 2. Criar Novo Link

1. Clique em "+ Novo Link"
2. Preencha a URL original
3. Adicione título e descrição (opcional)
4. Escolha categoria
5. Clique em "Criar Link"

### 3. Gerenciar Links

- **Testar**: Abre o link em nova aba
- **Copiar**: Copia URL curta para clipboard
- **Editar**: Modifica informações do link
- **Deletar**: Remove link permanentemente

### 4. Ver Estatísticas

- **Dashboard**: Visão geral de todos os links
- **Métricas**: Cliques por período, dispositivo, país
- **Gráficos**: Evolução temporal dos cliques

## 📊 Estrutura do Firestore

### Coleção: `shortLinks`

```javascript
{
  id: "auto-generated",
  originalUrl: "https://exemplo.com/pagina-muito-longa",
  shortCode: "meulink",
  shortUrl: "https://app.com/l/meulink",
  title: "Título do Link",
  description: "Descrição opcional",
  category: "evento",
  isActive: true,
  isPublic: true,
  clickCount: 42,
  uniqueVisitors: 35,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  expiresAt: Timestamp, // opcional
  createdBy: "user-id",
  analytics: {
    totalClicks: 42,
    clicksByDate: { "2025-01-15": 5, "2025-01-16": 8 },
    clicksByHour: { "09": 3, "14": 7, "20": 2 },
    clicksByDevice: { "mobile": 25, "desktop": 15, "tablet": 2 },
    clicksByCountry: { "BR": 35, "US": 5, "AR": 2 }
  }
}
```

### Coleção: `shortLinkClicks`
```javascript
{
  id: "auto-generated",
  shortLinkId: "link-id",
  clickedAt: Timestamp,
  userAgent: "Mozilla/5.0...",
  referrer: "https://google.com",
  device: "mobile",
  country: "BR",
  userId: "user-id", // opcional
  sessionId: "session-id"
}
```

## 🔧 Configuração Inicial

### 1. Links Automáticos

O sistema cria automaticamente links essenciais:

```javascript
// Links iniciais criados automaticamente
{
  "ingresso2025": "https://www.brasilgamesscoreboard.com.br/checkout/...",
  "comunidade": "https://chat.whatsapp.com/FHTqm0l36kc7RWYWMw1Kiz",
  "instagram": "https://www.instagram.com/cerradointerbox",
  "facebook": "https://www.facebook.com/cerradointerbox",
  "youtube": "https://www.youtube.com/@cerradointerbox"
}
```

### 2. Ferramenta Administrativa

Acesse `/links` como admin para:

- Criar links iniciais automaticamente
- Criar links personalizados
- Gerenciar todos os links do sistema

## 🛡️ Segurança

### Validação de Dados

- **URLs**: Verifica protocolo e formato
- **Códigos**: Caracteres permitidos apenas (a-z, 0-9, -, _)
- **Tamanhos**: Limites máximos para todos os campos
- **Códigos reservados**: Bloqueia palavras-chave do sistema

### Rate Limiting

- **Cliques**: Máximo por sessão
- **Criação**: Limite de links por usuário
- **API**: Proteção contra spam

### Sanitização

- **XSS**: Remove tags HTML perigosas
- **Injection**: Escapa caracteres especiais
- **Encoding**: Trata caracteres especiais corretamente

## 📱 URLs de Exemplo

### Links Criados

```
/l/ingresso2025 → Comprar Ingresso
/l/comunidade   → WhatsApp da Comunidade
/l/instagram    → Instagram Oficial
/l/facebook     → Facebook Oficial
/l/youtube      → YouTube Oficial
```

### URLs Completas

```
https://cerradointerbox.com.br/l/ingresso2025
https://cerradointerbox.com.br/l/comunidade
https://cerradointerbox.com.br/l/instagram
```

## 🎨 Interface do Usuário

### Design System

- **Cores**: Gradientes rosa/roxo do CERRADØ
- **Animações**: Framer Motion para transições suaves
- **Responsivo**: Mobile-first design
- **Acessibilidade**: Contraste e navegação por teclado

### Estados Visuais

- **Loading**: Spinners e skeletons
- **Sucesso**: Feedback verde com animações
- **Erro**: Mensagens claras em vermelho
- **Vazio**: Estados para dados inexistentes

## 📈 Analytics e Métricas

### Métricas Principais
- **Total de cliques**: Soma de todos os cliques
- **Cliques hoje**: Contador diário
- **Dispositivo mais usado**: Mobile/Desktop/Tablet
- **País principal**: Origem geográfica

### Relatórios Disponíveis
- **Por período**: Diário, semanal, mensal
- **Por dispositivo**: Distribuição de plataformas
- **Por localização**: Mapa de cliques por país
- **Por hora**: Padrões de uso temporal

## 🔄 Integração com App Fenix

### Rotas Adicionadas
```javascript
// App.tsx
<Route path="/links" element={<LinkShortenerPage />} />
<Route path="/l/:shortCode" element={<LinkRedirectWrapper />} />
```

### Componentes Integrados
- **Header**: Link para encurtador
- **Hub**: Card de acesso rápido
- **TempoReal**: Link encurtado para ingressos

### Gamificação
- **Pontos**: Cliques geram pontos para usuários
- **Ranking**: Links mais populares no leaderboard
- **Conquistas**: Badges por uso do sistema

## 🚀 Deploy e Produção

### Build
```bash
npm run build
```

### Deploy Firebase
```bash
firebase deploy
```

### Variáveis de Ambiente
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=interbox-box-app25
# ... outras configs Firebase
```

## 📝 Próximos Passos

### Funcionalidades Futuras
- [ ] QR Codes para links
- [ ] Links com senha
- [ ] Expiração automática
- [ ] Integração com redes sociais
- [ ] API pública para terceiros
- [ ] Relatórios avançados
- [ ] Notificações de cliques
- [ ] Links em lote

### Melhorias Técnicas
- [ ] Cache Redis para performance
- [ ] CDN para links estáticos
- [ ] Compressão de URLs
- [ ] Backup automático
- [ ] Monitoramento avançado

## 🤝 Contribuição

### Padrões de Código
- **TypeScript**: Tipagem estrita
- **ESLint**: Linting automático
- **Prettier**: Formatação consistente
- **Tests**: Cobertura de testes

### Fluxo de Desenvolvimento
1. Fork do repositório
2. Branch feature (`feature/link-shortener`)
3. Commit com mensagens claras
4. Pull Request com descrição
5. Code review obrigatório

## 📞 Suporte

### Documentação
- **README**: Visão geral do projeto
- **API Docs**: Documentação técnica
- **Guia de Uso**: Tutorial passo a passo

### Contato
- **Email**: admin@interbox.com.br
- **GitHub**: Issues e Pull Requests
- **Discord**: Comunidade de desenvolvedores

---

**Desenvolvido para o CERRADO INTERBØX 2025** 🏆
*O maior evento de times da América Latina* 