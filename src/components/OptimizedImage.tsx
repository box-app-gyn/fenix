import React from 'react'

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
      />
    )
  }

  // Para WebP, criar fallback para PNG
  const pngFallback = src.replace('.webp', '.png')

  return (
    <picture>
      <source srcSet={src} type="image/webp" />
      <img
        src={pngFallback}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={style}
      />
    </picture>
  )
} 