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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`lazy-image-wrapper ${className}`}
      style={{
        backgroundColor: placeholderColor,
        width: width ? `${width}px` : '100%',
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {isInView && (
        <img
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