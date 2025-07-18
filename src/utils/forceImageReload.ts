/**
 * Utilitário agressivo para forçar reload das imagens WebP
 */

// Lista de imagens WebP que precisam ser recarregadas
const webpImages = [
  '/images/bg_main.webp',
  '/images/pngtree-light-gray-old-paper.webp',
  '/logos/oficial_logo.webp',
  '/logos/nome_hrz.webp',
  '/images/bg_rounded.webp',
  '/images/twolines.webp'
]

// Lista de imagens PNG de fallback
const pngFallbacks = [
  '/images/bg_main.png',
  '/images/pngtree-light-gray-old-paper.png',
  '/logos/oficial_logo.png',
  '/logos/nome_hrz.png',
  '/images/bg_rounded.png',
  '/images/twolines.png'
]

/**
 * Força o reload de todas as imagens WebP
 */
export function forceWebPImageReload() {
  console.log('🔄 Forçando reload de imagens WebP...')
  
  // Limpar cache do navegador se disponível
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name)
        console.log(`🗑️ Cache limpo: ${name}`)
      })
    })
  }
  
  // Recarregar imagens existentes na página
  const existingImages = document.querySelectorAll('img[src*=".webp"]')
  Array.from(existingImages).forEach((img: Element) => {
    const imgElement = img as HTMLImageElement
    const originalSrc = imgElement.src.split('?')[0]
    imgElement.src = `${originalSrc}?v=${Date.now()}`
    console.log(`🔄 Recarregando: ${originalSrc}`)
  })
  
  // Recarregar background images
  const elementsWithBg = document.querySelectorAll('[style*="background-image"]')
  elementsWithBg.forEach((element: Element) => {
    const style = (element as HTMLElement).style
    if (style.backgroundImage && style.backgroundImage.includes('.webp')) {
      const originalBg = style.backgroundImage.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1')
      const newBg = `${originalBg}?v=${Date.now()}`
      style.backgroundImage = `url("${newBg}")`
      console.log(`🔄 Recarregando background: ${originalBg}`)
    }
  })
  
  // Pré-carregar imagens WebP
  webpImages.forEach(src => {
    const img = new Image()
    img.onload = () => console.log(`✅ Pré-carregado: ${src}`)
    img.onerror = () => {
      console.warn(`⚠️ Falha ao pré-carregar WebP: ${src}`)
      // Tentar PNG como fallback
      const pngSrc = src.replace('.webp', '.png')
      const pngImg = new Image()
      pngImg.onload = () => console.log(`✅ Fallback PNG carregado: ${pngSrc}`)
      pngImg.onerror = () => console.error(`❌ Falha no fallback PNG: ${pngSrc}`)
      pngImg.src = pngSrc
    }
    img.src = `${src}?v=${Date.now()}`
  })
}

/**
 * Verifica se o navegador suporta WebP
 */
export function checkWebPSupport(): boolean {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * Testa o carregamento de uma imagem específica
 */
export function testImageLoad(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

/**
 * Testa todas as imagens WebP e retorna status
 */
export async function testAllWebPImages(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}
  
  for (const src of webpImages) {
    results[src] = await testImageLoad(src)
  }
  
  return results
}

/**
 * Força reload específico de uma imagem
 */
export function forceSingleImageReload(src: string) {
  const img = new Image()
  img.onload = () => console.log(`✅ Imagem recarregada: ${src}`)
  img.onerror = () => console.error(`❌ Falha ao recarregar: ${src}`)
  img.src = `${src}?v=${Date.now()}`
}

/**
 * Limpa cache e força reload completo
 */
export function clearCacheAndReload() {
  console.log('🧹 Limpando cache e forçando reload...')
  
  // Limpar cache do service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister()
        console.log('🗑️ Service Worker desregistrado')
      })
    })
  }
  
  // Limpar cache do navegador
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name)
        console.log(`🗑️ Cache limpo: ${name}`)
      })
    })
  }
  
  // Forçar reload da página após um pequeno delay
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

// Exportar listas para uso em outros componentes
export { webpImages, pngFallbacks } 