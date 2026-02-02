import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';

const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  placeholder = 'blur',
  aspectRatio,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden bg-muted', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {isInView && (
        <>
          {!isLoaded && placeholder === 'blur' && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            loading="lazy"
            {...props}
          />
        </>
      )}
    </div>
  );
};

export default OptimizedImage;
