export function AuthHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-balance-safe">{title}</h1>
      {subtitle && <p className="text-sm text-pretty text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export function AuthAlert({ tone, children }: { tone: 'error' | 'success'; children: React.ReactNode }) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={
        tone === 'error'
          ? 'brand-error-alert rounded-lg border border-transparent bg-destructive/5 px-3 py-2.5 text-sm text-destructive'
          : 'rounded-lg border border-brand-emerald/30 bg-brand-emerald/10 px-3 py-2.5 text-sm text-emerald-800 dark:text-emerald-300'
      }
    >
      {children}
    </p>
  )
}
