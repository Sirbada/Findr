'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language } from './translations'

type Translations = typeof translations.fr | typeof translations.en

type TranslationContextType = {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const TranslationContext = createContext<TranslationContextType | null>(null)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr')
  const [mounted, setMounted] = useState(false)

  // Load saved language on mount
  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem('findr-lang') as Language
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      setLangState(savedLang)
    }
  }, [])

  // Save language when it changes
  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('findr-lang', newLang)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <TranslationContext.Provider
        value={{
          lang: 'fr',
          setLang,
          t: translations.fr as Translations,
        }}
      >
        {children}
      </TranslationContext.Provider>
    )
  }

  return (
    <TranslationContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang] as Translations,
      }}
    >
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }
  return context
}
