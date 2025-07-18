import { useState, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  style?: React.CSSProperties
}

export default function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  style,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [webpSupported, setWebpSupported] = useState(true)
  
  // Verificar suporte a WebP
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }
    setWebpSupported(checkWebPSupport())
  }, [])

  // Se a imagem já é PNG, usar diretamente
  if (src.endsWith('.png')) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={style}
        onError={() => {
          console.error('Erro ao carregar imagem PNG:', src)
        }}
      />
    )
  }

  // Para WebP, criar fallback para PNG
  const pngFallback = src.replace('.webp', '.png')
  const webpSrc = src.endsWith('.webp') ? src : src

  // Se WebP não é suportado ou houve erro, usar PNG diretamente
  if (!webpSupported || imageError) {
    return (
      <img
        src={pngFallback}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={style}
        onError={() => {
          console.error('Erro ao carregar imagem PNG de fallback:', pngFallback)
        }}
      />
    )
  }

  // Usar picture element para melhor compatibilidade
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={pngFallback}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={style}
        onError={() => {
          console.error('Erro ao carregar imagem WebP:', webpSrc)
          setImageError(true)
        }}
      />
    </picture>
  )
} 