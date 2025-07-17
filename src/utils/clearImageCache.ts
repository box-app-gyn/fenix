/**
 * Utilitário para limpar cache de imagens e forçar reload
 */

export const clearImageCache = async () => {
  // Limpar cache do service worker
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
      console.log('Service workers desregistrados')
    } catch (error) {
      console.error('Erro ao desregistrar service workers:', error)
    }
  }

  // Limpar cache do navegador para imagens específicas
  const imagesToReload = [
    '/images/bg_main.webp',
    '/images/pngtree-light-gray-old-paper.webp',
    '/logos/oficial_logo.webp',
    '/logos/nome_hrz.webp',
    '/images/bg_rounded.webp',
    '/images/twolines.webp',
  ]

  // Forçar reload das imagens
  imagesToReload.forEach((src) => {
    const img = new Image()
    img.src = `${src}?v=${Date.now()}`
  })

  // Recarregar a página após um breve delay
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

export const preloadImages = () => {
  const imagesToPreload = [
    '/images/bg_main.webp',
    '/images/pngtree-light-gray-old-paper.webp',
    '/logos/oficial_logo.webp',
    '/logos/nome_hrz.webp',
  ]

  imagesToPreload.forEach((src) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
} 