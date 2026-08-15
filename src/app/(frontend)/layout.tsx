import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Analytics } from '@vercel/analytics/next'

import { AdminBar } from '@/components/AdminBar'
import { JsonLd } from '@/components/JsonLd'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { mergeTwitter } from '@/utilities/mergeTwitter'
import { getOrganizationSchema } from '@/utilities/structuredData'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

import { Noto_Serif, Noto_Sans, Noto_Sans_Mono } from 'next/font/google'

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif',
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
})

const notoMono = Noto_Sans_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-mono',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const footerGlobal = await getCachedGlobal('footer', 1)()

  return (
    <html
      className={cn(notoSerif.variable, notoSans.variable, notoMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <JsonLd data={getOrganizationSchema(footerGlobal)} />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header />
            <main className="flex-1 min-h-screen">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: mergeTwitter(),
}
