'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = 'var(--c-surface-2)',
}: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`lazy-image-wrapper ${className}`}
      style={{
        backgroundColor: placeholderColor,
        width: width ? `${width}px` : '100%',
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && <div className="lazy-image-placeholder" />}
    </div>
  );
}