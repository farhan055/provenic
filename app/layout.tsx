import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Geist,
  Geist_Mono,
  Poppins,
  Noto_Sans_Arabic,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Noto_Sans_SC,
} from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { Toaster } from '@/components/ui/sonner'
import { getI18n } from '@/lib/i18n/server'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-poppins', display: 'swap' })
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-noto-arabic', display: 'swap', preload: false })
const notoNaskh = Noto_Naskh_Arabic({ subsets: ['arabic'], variable: '--font-noto-naskh', display: 'swap', preload: false })
const notoNastaliq = Noto_Nastaliq_Urdu({ subsets: ['arabic'], weight: ['500', '600', '700'], variable: '--font-noto-nastaliq', display: 'swap', preload: false })
const notoSC = Noto_Sans_SC({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-noto-sc', display: 'swap', preload: false })

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return {
    title: { default: t('meta.title'), template: `%s · Provenic` },
    description: t('meta.description'),
    applicationName: 'Provenic',
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
      apple: '/apple-icon.png',
    },
    openGraph: { title: t('meta.title'), description: t('meta.description'), siteName: 'Provenic', type: 'website' },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafb' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, dir, dict } = await getI18n()
  const fontVars = [geist, geistMono, poppins, notoArabic, notoNaskh, notoNastaliq, notoSC].map((f) => f.variable).join(' ')

  return (
    <html lang={locale} dir={dir} className={fontVars} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <I18nProvider locale={locale} dict={dict}>
            {children}
            <Toaster position={dir === 'rtl' ? 'bottom-left' : 'bottom-right'} dir={dir} />
          </I18nProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
