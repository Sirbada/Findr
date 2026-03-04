'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Currency = 'XAF' | 'EUR' | 'USD'

// Exchange rates (XAF per 1 unit of foreign currency)
const EXCHANGE_RATES: Record<Currency, number> = {
  XAF: 1,
  EUR: 655.957, // Fixed rate (CFA Franc pegged to Euro)
  USD: 610,     // Approximate
}

interface DiasporaContextType {
  isDiasporaMode: boolean
  currency: Currency
  toggleDiasporaMode: () => void
  setCurrency: (currency: Currency) => void
  convertPrice: (xafAmount: number) => { amount: number; formatted: string }
}

const DiasporaContext = createContext<DiasporaContextType | null>(null)

export function DiasporaProvider({ children }: { children: ReactNode }) {
  const [isDiasporaMode, setIsDiasporaMode] = useState(false)
  const [currency, setCurrencyState] = useState<Currency>('XAF')

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('diaspora_mode')
      const storedCurrency = localStorage.getItem('diaspora_currency') as Currency | null
      if (stored === 'true') {
        setIsDiasporaMode(true)
      }
      if (storedCurrency && ['XAF', 'EUR', 'USD'].includes(storedCurrency)) {
        setCurrencyState(storedCurrency)
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, [])

  function toggleDiasporaMode() {
    const next = !isDiasporaMode
    setIsDiasporaMode(next)
    try {
      localStorage.setItem('diaspora_mode', next ? 'true' : 'false')
      if (!next) {
        // Reset to XAF when disabling diaspora mode
        setCurrencyState('XAF')
        localStorage.setItem('diaspora_currency', 'XAF')
      } else if (currency === 'XAF') {
        // Default to EUR when enabling
        setCurrencyState('EUR')
        localStorage.setItem('diaspora_currency', 'EUR')
      }
    } catch {
      // ignore
    }
  }

  function setCurrency(c: Currency) {
    setCurrencyState(c)
    try {
      localStorage.setItem('diaspora_currency', c)
    } catch {
      // ignore
    }
  }

  function convertPrice(xafAmount: number): { amount: number; formatted: string } {
    if (currency === 'XAF') {
      const formatted = new Intl.NumberFormat('fr-FR').format(xafAmount) + ' XAF'
      return { amount: xafAmount, formatted }
    }

    const rate = EXCHANGE_RATES[currency]
    const converted = Math.round((xafAmount / rate) * 100) / 100

    let formatted: string
    if (currency === 'EUR') {
      formatted = converted.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
    } else {
      formatted = converted.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }

    return { amount: converted, formatted }
  }

  return (
    <DiasporaContext.Provider value={{
      isDiasporaMode,
      currency,
      toggleDiasporaMode,
      setCurrency,
      convertPrice,
    }}>
      {children}
    </DiasporaContext.Provider>
  )
}

export function useDiaspora(): DiasporaContextType {
  const ctx = useContext(DiasporaContext)
  if (!ctx) {
    // Graceful fallback when context is not available
    return {
      isDiasporaMode: false,
      currency: 'XAF',
      toggleDiasporaMode: () => {},
      setCurrency: () => {},
      convertPrice: (xafAmount: number) => ({
        amount: xafAmount,
        formatted: new Intl.NumberFormat('fr-FR').format(xafAmount) + ' XAF',
      }),
    }
  }
  return ctx
}
