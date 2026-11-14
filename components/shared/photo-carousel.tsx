'use client'

import Image from 'next/image'
import { Pause, Play } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Slide = { src: string; alt: string }
type CarouselLabels = {
  description: string
  pause: string
  resume: string
  slide: string
}

export function PhotoCarousel({
  slides,
  labels,
  className,
  overlayClassName,
  showPauseControl = true,
  children,
  priority = false,
}: {
  slides: Slide[]
  labels: CarouselLabels
  className?: string
  overlayClassName?: string
  showPauseControl?: boolean
  children?: ReactNode
  priority?: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [motionAllowed, setMotionAllowed] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      const allowed = !preference.matches
      setMotionAllowed(allowed)
      if (!allowed) setIsPlaying(false)
    }
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isPlaying || !motionAllowed || slides.length < 2) return
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length)
    }, 5200)
    return () => window.clearInterval(interval)
  }, [isPlaying, motionAllowed, slides.length])

  return (
    <div
      role="group"
      aria-label={labels.description}
      className={cn('relative isolate overflow-hidden rounded-3xl border bg-brand-night shadow-elevated', className)}
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={index === activeIndex ? slide.alt : ''}
            aria-hidden={index !== activeIndex}
            fill
            priority={priority && index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 720px"
            className={cn(
              'object-cover transition-opacity duration-700 motion-reduce:transition-none',
              index === activeIndex ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
      </div>
      <div aria-hidden className={cn('absolute inset-0 bg-gradient-to-t from-brand-night/75 via-brand-night/10 to-brand-night/5', overlayClassName)} />
      <div className="relative z-10 h-full">{children}</div>
      {slides.length > 1 && (
        <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5" role="group" aria-label={labels.description}>
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={labels.slide.replace('{index}', String(index + 1))}
                aria-pressed={activeIndex === index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'size-2.5 rounded-full border border-white/60 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                  activeIndex === index ? 'w-7 bg-white' : 'bg-white/40 hover:bg-white/80',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label={isPlaying ? labels.pause : labels.resume}
            aria-pressed={isPlaying}
            onClick={() => setIsPlaying((playing) => !playing)}
            className={cn(
              'brand-hover inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-brand-night/50 text-white shadow-md backdrop-blur-md transition-colors hover:bg-brand-night/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
              !showPauseControl && 'sr-only focus:not-sr-only',
            )}
          >
            {isPlaying ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
          </button>
        </div>
      )}
    </div>
  )
}
