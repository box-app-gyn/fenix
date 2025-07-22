# Páginas e Componentes do App Fenix

## 🏠 Páginas Principais

### `/` - Página Inicial (HomePage)

- **Hero**: Seção principal com chamada para ação
- **TempoReal**: Dados em tempo real do evento
- **GamifiedLeaderboard**: Ranking gamificado
- **CallToAction**: Chamadas para ação
- **Sobre**: Informações sobre o projeto

### `/hub` - Hub Principal

- Dashboard com cards de navegação
- Links para todas as funcionalidades principais
- Interface centralizada

### `/tempo-real` - Tempo Real

- Dados em tempo real do Firestore
- Contagem regressiva para ingressos
- Estatísticas do evento
- Indicadores de progresso

### `/leaderboard` - Leaderboard Gamificado
- Ranking dos participantes
- Sistema de pontuação
- Animações e confetti
- Dados em tempo real

### `/audiovisual` - Análise Audiovisual
- Upload e análise de conteúdo
- Processamento de imagens/vídeos
- Dashboard de métricas

### `/admin` - Painel Administrativo
- Gerenciamento de usuários
- Estatísticas do sistema
- Configurações avançadas
- Moderação de conteúdo

### `/sobre` - Sobre o Projeto
- Informações sobre o Interbox 2025
- Equipe e colaboradores
- Tecnologias utilizadas

## 🔧 Componentes Disponíveis

### Componentes de UI
- **Header**: Navegação principal com autenticação
- **Footer**: Rodapé com links e informações
- **Hero**: Seção hero com animações
- **LoadingSpinner**: Spinner de carregamento
- **FirebaseErrorBoundary**: Tratamento de erros do Firebase

### Componentes de Gamificação
- **GamifiedLeaderboard**: Ranking interativo
- **GamifiedCTA**: Chamadas para ação gamificadas
- **ConfettiExplosion**: Efeitos visuais de celebração

### Componentes de Dados
- **TempoReal**: Dados em tempo real do Firestore
- **AudiovisualAnalysis**: Análise de conteúdo
- **SplashScreen**: Tela de carregamento inicial

### Componentes de Marketing
- **CallToAction**: CTAs otimizados
- **SEOHead**: Meta tags e SEO

## 🛠️ Funcionalidades Implementadas

### ✅ Autenticação
- Login com Google (Firebase Auth)
- Proteção de rotas
- Gerenciamento de estado do usuário

### ✅ Tempo Real
- Conexão com Firestore
- Atualizações em tempo real
- Contadores e estatísticas

### ✅ Gamificação
- Sistema de pontuação
- Leaderboards interativos
- Animações e efeitos visuais

### ✅ Responsividade
- Design mobile-first
- Animações suaves
- Interface adaptativa

### ✅ Performance
- Lazy loading de componentes
- Otimização de imagens
- Cache inteligente

## 🚀 Próximos Passos

1. **Configurar Firebase Console** (seguir FIREBASE_SETUP.md)
2. **Testar todas as funcionalidades**
3. **Implementar PWA**
4. **Deploy em produção**
5. **Configurar analytics**

## 📱 Rotas de Navegação

```
/                    → Página inicial com todos os componentes
/hub                 → Hub principal com navegação
/tempo-real          → Dados em tempo real
/leaderboard         → Ranking gamificado
/audiovisual         → Análise de conteúdo
/admin               → Painel administrativo
/sobre               → Sobre o projeto
/cadastro-*          → Páginas de cadastro (temporárias)
/setup-profile       → Configuração de perfil
```

## 🔗 Links Úteis

- **Firebase Console**: <https://console.firebase.google.com/>
- **Documentação Firebase**: <https://firebase.google.com/docs>
- **Vite Docs**: <https://vitejs.dev/>
- **Tailwind CSS**: <https://tailwindcss.com/>
