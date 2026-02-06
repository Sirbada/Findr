'use client'

import { ReactNode } from 'react'
import { TranslationProvider } from '@/lib/i18n/context'
import { DataSaverProvider } from '@/lib/data-saver/context'
import { InstallBanner } from '@/components/ui/InstallPrompt'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      <DataSaverProvider>
        {children}
        {/* PWA Install Banner - Shows on mobile when not installed */}
        <InstallBanner />
      </DataSaverProvider>
    </TranslationProvider>
  )
}
