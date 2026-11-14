import { cn } from '@/lib/utils'

type LogoProps = {
  /** full = mark + wordmark + tagline; wordmark = mark + wordmark; mark = symbol only */
  variant?: 'full' | 'wordmark' | 'mark'
  className?: string
  /** Force the dark-background artwork regardless of theme. */
  onDark?: boolean
}

const assets = {
  full: { light: '/brand/logo-light.svg', dark: '/brand/logo-dark.svg', w: 1416, h: 512 },
  wordmark: { light: '/brand/wordmark-light.svg', dark: '/brand/wordmark-dark.svg', w: 1310, h: 356 },
  mark: { light: '/brand/mark.svg', dark: '/brand/mark-dark.svg', w: 512, h: 512 },
}

export function Logo({ variant = 'wordmark', className, onDark = false }: LogoProps) {
  const a = assets[variant]
  const common = {
    width: a.w,
    height: a.h,
    alt: variant === 'full' ? 'Provenic — Every promise, proven.' : 'Provenic',
    decoding: 'async' as const,
  }

  if (onDark) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={a.dark} {...common} className={cn('h-8 w-auto', className)} />
  }

  return (
    <span className={cn('inline-flex shrink-0', className)} dir="ltr">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.light} {...common} className="h-full w-auto dark:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.dark} {...common} alt="" aria-hidden className="hidden h-full w-auto dark:block" />
    </span>
  )
}
