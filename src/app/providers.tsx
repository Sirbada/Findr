'use client'

import { ReactNode } from 'react'
import { TranslationProvider } from '@/lib/i18n/context'
import { DataSaverProvider } from '@/lib/data-saver/context'
import { InstallBanner } from '@/components/ui/InstallPrompt'
import { DiasporaProvider } from '@/lib/diaspora/context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      <DataSaverProvider>
        <DiasporaProvider>
          {children}
          {/* PWA Install Banner - Shows on mobile when not installed */}
          <InstallBanner />
        </DiasporaProvider>
      </DataSaverProvider>
    </TranslationProvider>
  )
}
