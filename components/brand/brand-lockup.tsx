import { Logo } from '@/components/brand/logo'
import { cn } from '@/lib/utils'

type BrandLockupSize = 'header' | 'mobile' | 'sidebar' | 'panel' | 'footer'

const sizes: Record<BrandLockupSize, { logo: string; tagline: string; indent: string }> = {
  header: { logo: 'h-8', tagline: 'text-[10px]', indent: 'ps-10' },
  mobile: { logo: 'h-7', tagline: 'text-[9px]', indent: 'ps-9' },
  sidebar: { logo: 'h-8', tagline: 'text-[10px]', indent: 'ps-10' },
  panel: { logo: 'h-12', tagline: 'text-[11px]', indent: 'ps-14' },
  footer: { logo: 'h-10', tagline: 'text-[10px]', indent: 'ps-12' },
}

export function BrandLockup({
  size = 'header',
  onDark = false,
  className,
}: {
  size?: BrandLockupSize
  onDark?: boolean
  className?: string
}) {
  const style = sizes[size]

  return (
    <span dir="ltr" className={cn('inline-flex shrink-0 flex-col items-start gap-0.5', className)}>
      <Logo variant="wordmark" onDark={onDark} className={style.logo} />
      <span className={cn(style.indent, 'leading-none tracking-wide', style.tagline, onDark ? 'text-white/80' : 'text-muted-foreground')}>
        Every promise, proven.
      </span>
    </span>
  )
}
