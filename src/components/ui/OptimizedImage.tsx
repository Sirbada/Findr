'use client'

import { useState, useEffect, useRef } from 'react'
import { useDataSaver } from '@/lib/data-saver/context'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  placeholder?: 'blur' | 'empty'
}

// Generate optimized image URL (works with Unsplash, Supabase Storage, etc.)
function getOptimizedUrl(src: string, quality: 'low' | 'medium' | 'high', width?: number): string {
  // For Unsplash images
  if (src.includes('unsplash.com')) {
    const qualityMap = { low: 30, medium: 60, high: 80 }
    const widthMap = { low: 400, medium: 800, high: 1200 }
    const w = width || widthMap[quality]
    const q = qualityMap[quality]
    
    // Remove existing params and add new ones
    const baseUrl = src.split('?')[0]
    return `${baseUrl}?w=${w}&q=${q}&fm=webp&fit=crop`
  }
  
  // For Supabase Storage - add transform params
  if (src.includes('supabase')) {
    const qualityMap = { low: 30, medium: 60, high: 80 }
    const widthMap = { low: 400, medium: 800, high: 1200 }
    const w = width || widthMap[quality]
    const q = qualityMap[quality]
    
    if (src.includes('/storage/v1/object/public/')) {
      return src.replace(
        '/storage/v1/object/public/',
        `/storage/v1/render/image/public/`
      ) + `?width=${w}&quality=${q}`
    }
  }
  
  // Return original for other sources
  return src
}

// Tiny placeholder (1x1 pixel base64)
const PLACEHOLDER_BLUR = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAED/AAKoAf/Z'

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'blur',
}: OptimizedImageProps) {
  const { imageQuality, isDataSaverActive } = useDataSaver()
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (priority || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [priority])

  const optimizedSrc = getOptimizedUrl(src, imageQuality, width)

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && !loaded && (
        <img
          src={PLACEHOLDER_BLUR}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      {inView && !error && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
      
      {/* Data saver indicator */}
      {isDataSaverActive && imageQuality === 'low' && loaded && (
        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">
          📉 Low
        </div>
      )}
    </div>
  )
}
