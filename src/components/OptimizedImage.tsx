import React, { useState, useEffect } from 'react';


interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  style,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Tentar fallback para PNG se não for PNG
      if (!src.endsWith('.png')) {
        const pngFallback = src.replace(/\.[^/.]+$/, '.png');
        setImageSrc(pngFallback);
      }
      onError?.();
    }
  };

  const handleLoad = () => {
    onLoad?.();
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={style}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
} 