import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  eyebrow?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between md:pb-8">
      <div className="flex min-w-0 flex-col gap-1.5">
        {eyebrow && <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{eyebrow}</div>}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-balance-safe md:text-[1.75rem]">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-pretty text-muted-foreground md:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn('brand-rainbow-border rounded-xl border bg-card text-card-foreground shadow-elevated', className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3.5 md:px-5">
          <div className="flex min-w-0 flex-col gap-0.5">
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn('p-4 md:p-5', bodyClassName)}>{children}</div>
    </section>
  )
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  compact = false,
}: {
  icon?: React.ReactNode
  title: React.ReactNode
  body?: React.ReactNode
  action?: React.ReactNode
  compact?: boolean
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 text-center', compact ? 'py-6' : 'py-12 md:py-16')}>
      {icon && (
        <div className="flex size-11 items-center justify-center rounded-xl border bg-surface text-muted-foreground [&_svg]:size-5">
          {icon}
        </div>
      )}
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-sm font-semibold">{title}</p>
        {body && <p className="text-sm text-pretty text-muted-foreground">{body}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: React.ReactNode
  icon: React.ReactNode
  accent: 'violet' | 'cyan' | 'amber' | 'rose' | 'emerald' | 'orange'
}) {
  const accentClass = {
    violet: 'text-brand-violet bg-brand-violet/10',
    cyan: 'text-brand-cyan bg-brand-cyan/10',
    amber: 'text-amber-600 bg-brand-amber/15 dark:text-brand-amber',
    rose: 'text-brand-rose bg-brand-rose/10',
    emerald: 'text-brand-emerald bg-brand-emerald/10',
    orange: 'text-brand-orange bg-brand-orange/10',
  }[accent]
  return (
    <div className="brand-rainbow-border flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-elevated md:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground md:text-sm">{label}</span>
        <span className={cn('flex size-8 items-center justify-center rounded-lg [&_svg]:size-4', accentClass)}>{icon}</span>
      </div>
      <span className="font-display text-2xl font-semibold tabular-nums md:text-3xl">{value}</span>
    </div>
  )
}

export function DefinitionItem({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words">{children}</dd>
    </div>
  )
}
