'use client'

import { ReactNode } from 'react'
import { TranslationProvider } from '@/lib/i18n/context'
import { DataSaverProvider } from '@/lib/data-saver/context'
import { AuthProvider } from '@/lib/auth/context'
import { InstallBanner } from '@/components/ui/InstallPrompt'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      <AuthProvider>
        <DataSaverProvider>
          {children}
          {/* PWA Install Banner - Shows on mobile when not installed */}
          <InstallBanner />
        </DataSaverProvider>
      </AuthProvider>
    </TranslationProvider>
  )
}
