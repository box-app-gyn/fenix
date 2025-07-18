# 🎨 **Diretrizes de Branding - CERRADO INTERBØX 2025**

## 📋 **Visão Geral da Marca**

### **Missão**
Criar o maior ecossistema fitness do Brasil, conectando atletas, jurados, mídia e espectadores em uma experiência gamificada e inovadora.

### **Valores**

* **Inovação**: Tecnologia de ponta para gamificação
* **Comunidade**: Conexão entre todos os participantes
* **Excelência**: Qualidade em todos os aspectos
* **Inclusão**: Acesso para todos os tipos de participantes
* **Sustentabilidade**: Tokens \$BOX como economia digital

### **Slogan**

*"ᴄᴏᴍᴘᴇᴛɪçãᴏ. ᴄᴏᴍᴜɴɪᴅᴀᴅᴇ. ᴘʀᴏᴘóꜱɪᴛᴏ."*

---

## 🎨 **Identidade Visual**

### **Paleta de Cores**

#### **Cores Primárias**

* **Preto** (`#000000`): Sofisticação e poder
* **Rosa** (`#fb05e4`): Energia e paixão
* **Azul** (`#00259f`): Inovação e criatividade

#### **Cores Secundárias**

* **Cinza Escuro** (`#1F2937`): Profissionalismo
* **Cinza Claro** (`#F3F4F6`): Limpeza e clareza
* **Branco** (`#FFFFFF`): Pureza e simplicidade

#### **Cores de Acento**

* **Verde** (`#10B981`): Sucesso e crescimento
* **Azul** (`#00259f`): Confiança e tecnologia
* **Amarelo** (`#F59E0B`): Energia e otimismo

### **Gradientes Padrão**
```css
/* Gradiente principal */
background: linear-gradient(135deg, #000000 0%, #1F2937 50%, #00259f 100%);

/* Gradiente rosa-azul */
background: linear-gradient(135deg, #fb05e4 0%, #00259f 100%);

/* Gradiente suave */
background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);

/* BG principal */
background: ".public/images/bg_1.png"
```

---

## 📱 **Layout Padrão**

### **Estrutura de Páginas**

#### **Header (Cabeçalho)**

* Logo Interbox à esquerda
* Menu de navegação centralizado
* Avatar do usuário à direita (se logado)
* Altura: 64px
* Background: Preto com gradiente sutil

#### **Main Content (Conteúdo Principal)**

* Padding: 16px (mobile) / 24px (desktop)
* Max-width: 1200px (centralizado)
* Background: Gradiente Imagem principal ou degradê

#### **Footer (Rodapé)**

* Links importantes
* Redes sociais
* Informações de contato
* Background: Preto sólido
* **Única menção ao Protocolo NEØ**

### **Componentes Padrão**

#### **Cards**
```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 16px;
}
```

#### **Botões**
```css
/* Botão primário */
.btn-primary {
  background: linear-gradient(135deg, #fb05e4 0%, #00259f 100%);
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

/* Botão secundário */
.btn-secondary {
  background: transparent;
  color: #fb05e4;
  border: 2px solid #fb05e4;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}
```

#### **Inputs**
```css
.input {
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input:focus {
  border-color: #fb05e4;
  outline: none;
  box-shadow: 0 0 0 3px rgba(251, 5, 228, 0.1);
}
```

---

## 🎯 **Tipografia**

### **Hierarquia de Fontes**

#### **Títulos**

* **H1**: 32px, font-weight: 700, cor: #000000
* **H2**: 24px, font-weight: 600, cor: #1F2937
* **H3**: 20px, font-weight: 600, cor: #374151

#### **Corpo de Texto**

* **Parágrafo**: 16px, font-weight: 400, cor: #6B7280
* **Legenda**: 14px, font-weight: 400, cor: #9CA3AF
* **Pequeno**: 12px, font-weight: 400, cor: #D1D5DB

### **Fonte Principal**

* **Inter** (Google Fonts)
* Fallback: system-ui, -apple-system, sans-serif

---

## 🎮 **Gamificação Visual**

### **Tokens \$BOX**

* **Ícone**: ₿ ou Ξ
* **Cor**: rgb(251, 5, 228)
* **Animação**: Pulsar suave ao ganhar

### **Níveis**

* **Iniciante**: Verde (#10B981)
* **Bronze**: Marrom (#92400E)
* **Prata**: Cinza (#6B7280)
* **Ouro**: Dourado (#F59E0B)
* **Platina**: Azul (#3B82F6)
* **Diamante**: Roxo (#8B5CF6)

### **Conquistas**

* **Badge**: Círculo com ícone
* **Background**: Gradiente rosa-azul
* **Animação**: Rotação 360° ao desbloquear

---

## 📐 **Espaçamento e Grid**

### **Sistema de Espaçamento**

* 4px: Espaçamento mínimo
* 8px: Espaçamento pequeno
* 16px: Espaçamento padrão
* 24px: Espaçamento médio
* 32px: Espaçamento grande
* 48px: Espaçamento extra grande

### **Grid System**
```css
.container {
  padding: 16px;
  max-width: 100%;
}

@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
  }
}
```

---

## 🎨 **Elementos Visuais**

### **Ícones**

* Estilo: Outline/Line icons
* Tamanho: 20px (padrão), 24px (destaque)
* Cor: #6B7280 (padrão), #fb05e4 (ativo)

### **Imagens**

* Formato: WebP (preferencial), PNG, JPG
* Otimização: Compressão automática
* Lazy Loading: Implementado

### **Animações**

* Duração: 0.3s (rápida), 0.5s (média), 0.8s (lenta)
* Easing: cubic-bezier(0.4, 0, 0.2, 1)
* Hover: Scale 1.05, shadow aumentada

---

## 📱 **Responsividade**

### **Breakpoints**

* Mobile: < 768px
* Tablet: 768px - 1024px
* Desktop: > 1024px

### **Mobile First**

* Design começa no mobile
* Progressive enhancement
* Touch-friendly (44px mínimo)

---

## 🎯 **Microinterações**

### **Loading States**

* Spinner: Círculo girando
* Skeleton: Placeholder animado
* Progress: Barra de progresso

### **Feedback**

* Sucesso: Verde com ícone ✅
* Erro: Vermelho com ícone ❌
* Aviso: Amarelo com ícone ⚠️
* Info: Azul com ícone ℹ️

---

## 🚀 **Performance**

### **Otimizações**

* Lazy Loading: Imagens e componentes
* Code Splitting: Por rota
* Caching: Service Worker
* Compression: Gzip/Brotli

### **Métricas**

* LCP: < 2.5s
* FID: < 100ms
* CLS: < 0.1

---

## 📽️ **Diretrizes para Vídeos e Animações**

### **Estilo Visual**

* Títulos com Inter Black
* Efeito glitch leve ao exibir logo
* Pulse visual nos ganhos de token \$BOX

### **Intro e Transições**

* Intro com logo animado em partículas (2.5s)
* Transições neon: Swipe rosa-azul com blend mode screen

---

## 🧠 **Diretrizes Técnicas**

### **Logos**

* Principal: `logo.png`
* Ícone: `logo_circulo.png`
* OG: `og-interbox.png`

### **Manifest.json (PWA)**

```json
{
  "name": "Interbox 2025",
  "short_name": "INTERBOX",
  "start_url": "/",
  "background_color": "#000000",
  "theme_color": "#00259f",
  "display": "standalone",
  "icons": [
    {
      "src": "/icons/logo_circulo.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### **OG Meta Tags**

```html
<meta property="og:image" content="/images/og-interbox.png" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

---

## 📞 **Contato**

Para dúvidas sobre branding ou sugestões:

* Email: [interbox25cerrado@gmail.com](mailto:interbox25cerrado@gmail.com)
* Slack: #design-system
* Figma: \[link do sistema de design]

---

*Última atualização: Junho 2025*
*Protocolo NEØ*
