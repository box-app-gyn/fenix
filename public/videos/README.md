# Vídeo de Intro

Este diretório deve conter o arquivo `intro.mp4` que será reproduzido na splash screen.

## Especificações Recomendadas

- **Formato**: MP4
- **Codec**: H.264
- **Resolução**: 1920x1080 (Full HD) ou 1280x720 (HD)
- **Duração**: 3-5 segundos
- **Tamanho**: Máximo 5MB para carregamento rápido
- **FPS**: 30fps

## Conteúdo Sugerido

O vídeo deve conter:
1. Logo do CERRADØ INTERBOX
2. Animação suave de entrada
3. Texto "2025" ou similar
4. Transição suave para o app

## Otimização

Para melhor performance:
- Comprima o vídeo adequadamente
- Use qualidade média-alta (não máxima)
- Teste em diferentes conexões
- Considere criar versões para diferentes resoluções

## Fallback

Se o vídeo não carregar ou falhar, o sistema mostrará:
- Logo estático do CERRADØ
- Animação de pulse
- Texto "CERRADØ INTERBOX 2025"

## Exemplo de Estrutura

```
videos/
├── intro.mp4          # Vídeo principal
├── intro-mobile.mp4   # Versão otimizada para mobile (opcional)
└── README.md          # Este arquivo
```

## Ferramentas para Criação

- Adobe After Effects
- DaVinci Resolve
- Final Cut Pro
- Online: Canva, CapCut 