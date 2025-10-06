import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  fallback?: React.ReactNode;
  onVisible?: () => void;
}

export default function ProgressiveLoader({
  children,
  delay = 0,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  fallback,
  onVisible
}: ProgressiveLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            setTimeout(() => {
              setShouldRender(true);
              onVisible?.();
            }, 100);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold, rootMargin, onVisible]);

  const defaultFallback = (
    <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  // Check if className contains grid layout classes
  const hasGridLayout = className.includes('grid') || className.includes('flex');
  
  // If it has grid/flex layout, use a wrapper that preserves layout
  if (hasGridLayout) {
    return (
      <>
        <div ref={elementRef} className="absolute opacity-0 pointer-events-none" />
        
        {!isVisible && (
          <div className={className}>
            {fallback || (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[420px] bg-gradient-to-br from-[#D2D0F7]/30 to-[#BBFF2C]/10 rounded-lg animate-pulse" />
                ))}
              </div>
            )}
          </div>
        )}
        
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className={className}
          >
            {shouldRender ? children : (fallback || defaultFallback)}
          </motion.div>
        )}
      </>
    );
  }

  // For non-layout components, use the simpler approach
  return (
    <div ref={elementRef} className={className}>
      {!isVisible && (fallback || defaultFallback)}
      
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {shouldRender ? children : (fallback || defaultFallback)}
        </motion.div>
      )}
    </div>
  );
}