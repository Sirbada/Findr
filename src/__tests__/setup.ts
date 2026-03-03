import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Clean up after each test case
afterEach(() => {
  cleanup()
})

// Mock environment variables
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock Next.js router
  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    useSearchParams: () => ({
      get: vi.fn(),
      has: vi.fn(),
      getAll: vi.fn(),
    }),
    usePathname: () => '/test',
  }))

  // Mock Supabase client
  vi.mock('@/lib/supabase/client', () => ({
    createClient: () => ({
      auth: {
        signInWithOtp: vi.fn(),
        verifyOtp: vi.fn(),
        getUser: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      })),
    }),
  }))

  // Mock translation context
  vi.mock('@/lib/i18n/context', () => ({
    useTranslation: () => ({
      lang: 'fr' as const,
      setLang: vi.fn(),
      t: (key: string) => key,
    }),
  }))

  // Mock Web APIs
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
  })

  Object.defineProperty(navigator, 'share', {
    value: vi.fn().mockResolvedValue(undefined),
  })

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  vi.stubGlobal('localStorage', localStorageMock)

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  vi.stubGlobal('sessionStorage', sessionStorageMock)

  // Mock environment
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  process.env.NODE_ENV = 'test'
})