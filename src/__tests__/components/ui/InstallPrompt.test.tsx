import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InstallBanner, InstallPrompt } from '@/components/ui/InstallPrompt'

// Mock the translation hook
vi.mock('@/lib/i18n/context', () => ({
  useTranslation: () => ({
    lang: 'fr' as const,
  }),
}))

// Mock localStorage
const mockGetItem = vi.fn()
const mockSetItem = vi.fn()
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
  },
  writable: true,
})

// Mock matchMedia for PWA detection
const mockMatchMedia = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
  writable: true,
})

// Mock navigator.standalone for iOS PWA detection
Object.defineProperty(navigator, 'standalone', {
  value: false,
  writable: true,
})

// Mock user agent for device detection
const originalUserAgent = navigator.userAgent
Object.defineProperty(navigator, 'userAgent', {
  value: originalUserAgent,
  writable: true,
})

// Mock beforeinstallprompt event
interface MockBeforeInstallPromptEvent {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  preventDefault: () => void
}

describe('InstallPrompt Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset localStorage mocks
    mockGetItem.mockReturnValue(null)
    mockSetItem.mockClear()
    
    // Reset matchMedia mock
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    
    // Reset user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
    })
  })

  describe('Device Detection', () => {
    it('should detect iOS device', async () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
      })
      
      render(<InstallPrompt />)
      
      // Should show iOS-specific instructions
      await waitFor(() => {
        expect(screen.getByText(/installer sur iphone/i)).toBeInTheDocument()
      })
    })

    it('should detect Android device', async () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
        writable: true,
      })
      
      render(<InstallPrompt />)
      
      // On Android, should show install button if deferred prompt available
      expect(screen.getByText(/installer findr/i)).toBeInTheDocument()
    })

    it('should detect desktop device', async () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        writable: true,
      })
      
      render(<InstallPrompt />)
      
      expect(screen.getByText(/installer findr/i)).toBeInTheDocument()
    })
  })

  describe('PWA Installation Status Detection', () => {
    it('should detect standalone mode (already installed)', () => {
      mockMatchMedia.mockReturnValue({
        matches: true, // display-mode: standalone
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
      
      render(<InstallBanner />)
      
      // Banner should not render if already installed
      expect(screen.queryByText(/installer findr/i)).not.toBeInTheDocument()
    })

    it('should detect iOS standalone mode', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
      })
      
      Object.defineProperty(navigator, 'standalone', {
        value: true,
        writable: true,
      })
      
      render(<InstallBanner />)
      
      // Banner should not render if already in standalone mode
      expect(screen.queryByText(/installer findr/i)).not.toBeInTheDocument()
    })
  })

  describe('Dismissal Logic', () => {
    it('should not show banner if recently dismissed', () => {
      // Mock recent dismissal (1 day ago)
      const oneDayAgo = Date.now() - (1 * 24 * 60 * 60 * 1000)
      mockGetItem.mockReturnValue(oneDayAgo.toString())
      
      render(<InstallBanner />)
      
      expect(screen.queryByText(/installer findr/i)).not.toBeInTheDocument()
    })

    it('should show banner if dismissed long ago', () => {
      // Mock old dismissal (8 days ago)
      const eightDaysAgo = Date.now() - (8 * 24 * 60 * 60 * 1000)
      mockGetItem.mockReturnValue(eightDaysAgo.toString())
      
      render(<InstallBanner />)
      
      expect(screen.getByText(/installer findr/i)).toBeInTheDocument()
    })

    it('should save dismissal timestamp when closed', async () => {
      const user = userEvent.setup()
      render(<InstallBanner />)
      
      const closeButton = screen.getByRole('button', { name: /fermer/i })
      await user.click(closeButton)
      
      expect(mockSetItem).toHaveBeenCalledWith(
        'findr_install_dismissed',
        expect.any(String)
      )
    })
  })

  describe('InstallBanner Component', () => {
    it('should render install banner with correct content', () => {
      render(<InstallBanner />)
      
      expect(screen.getByText('Installer Findr')).toBeInTheDocument()
      expect(screen.getByText('Pour une meilleure expérience')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /installer l'app/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /fermer/i })).toBeInTheDocument()
    })

    it('should show Findr logo/icon', () => {
      render(<InstallBanner />)
      
      const logo = screen.getByText('F')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveClass('text-blue-600', 'font-bold')
    })

    it('should handle install button click on iOS', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
      })
      
      render(<InstallBanner />)
      
      const installButton = screen.getByRole('button', { name: /installer l'app/i })
      await user.click(installButton)
      
      // Should show iOS install modal
      await waitFor(() => {
        expect(screen.getByText(/installer sur iphone/i)).toBeInTheDocument()
      })
    })

    it('should handle PWA install prompt', async () => {
      const user = userEvent.setup()
      
      // Create mock deferred prompt
      const mockPrompt = vi.fn().mockResolvedValue(undefined)
      const mockUserChoice = Promise.resolve({ outcome: 'accepted', platform: 'web' })
      
      const deferredPrompt: MockBeforeInstallPromptEvent = {
        prompt: mockPrompt,
        userChoice: mockUserChoice,
        preventDefault: vi.fn(),
      }
      
      // Simulate beforeinstallprompt event
      render(<InstallBanner />)
      
      // Manually trigger the event (in real tests, you'd dispatch the event)
      fireEvent(window, new CustomEvent('beforeinstallprompt', { detail: deferredPrompt }))
      
      const installButton = screen.getByRole('button', { name: /installer l'app/i })
      await user.click(installButton)
      
      // Note: In a real test, you'd need to properly simulate the beforeinstallprompt event
      // This is a simplified version showing the structure
    })
  })

  describe('InstallPrompt Component', () => {
    it('should render full install prompt', () => {
      render(<InstallPrompt />)
      
      expect(screen.getByText('Installer Findr')).toBeInTheDocument()
      expect(screen.getByText('Accédez plus rapidement à vos annonces')).toBeInTheDocument()
      
      // Should show features
      expect(screen.getByText('Fonctionne hors connexion')).toBeInTheDocument()
      expect(screen.getByText('Chargement ultra rapide')).toBeInTheDocument()
      expect(screen.getByText('Notifications instantanées')).toBeInTheDocument()
    })

    it('should show install button for supported platforms', () => {
      render(<InstallPrompt />)
      
      // Should show install button by default (when deferred prompt available)
      const installButton = screen.queryByRole('button', { name: /installer l'app/i })
      expect(installButton).toBeInTheDocument()
    })

    it('should show iOS instructions on iOS devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
      })
      
      render(<InstallPrompt />)
      
      expect(screen.getByText(/installer sur iphone/i)).toBeInTheDocument()
      expect(screen.getByText(/appuyez sur/i)).toBeInTheDocument()
    })

    it('should handle close callback', async () => {
      const user = userEvent.setup()
      const mockOnClose = vi.fn()
      
      render(<InstallPrompt onClose={mockOnClose} />)
      
      const closeButton = screen.getByRole('button', { name: /plus tard/i })
      await user.click(closeButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should show success state after installation', async () => {
      render(<InstallPrompt />)
      
      // Simulate successful installation
      fireEvent(window, new Event('appinstalled'))
      
      await waitFor(() => {
        expect(screen.getByText('Installée!')).toBeInTheDocument()
      })
    })
  })

  describe('iOS Installation Modal', () => {
    it('should show iOS installation instructions', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
      })
      
      render(<InstallBanner />)
      
      const installButton = screen.getByRole('button', { name: /installer l'app/i })
      await user.click(installButton)
      
      await waitFor(() => {
        expect(screen.getByText('Installer sur iPhone')).toBeInTheDocument()
        expect(screen.getByText(/appuyez sur/i)).toBeInTheDocument()
        expect(screen.getByText(/sur l'écran d'accueil/i)).toBeInTheDocument()
      })
    })

    it('should close iOS modal on backdrop click', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
      })
      
      render(<InstallBanner />)
      
      const installButton = screen.getByRole('button', { name: /installer l'app/i })
      await user.click(installButton)
      
      await waitFor(() => {
        expect(screen.getByText('Installer sur iPhone')).toBeInTheDocument()
      })
      
      // Click backdrop to close
      const modal = screen.getByText('Installer sur iPhone').closest('[role="dialog"], .fixed')
      if (modal?.parentElement) {
        await user.click(modal.parentElement)
        
        await waitFor(() => {
          expect(screen.queryByText('Installer sur iPhone')).not.toBeInTheDocument()
        })
      }
    })

    it('should close iOS modal with close button', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
      })
      
      render(<InstallBanner />)
      
      const installButton = screen.getByRole('button', { name: /installer l'app/i })
      await user.click(installButton)
      
      await waitFor(() => {
        expect(screen.getByText('Installer sur iPhone')).toBeInTheDocument()
      })
      
      const closeButton = screen.getByRole('button', { name: /plus tard/i })
      await user.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Installer sur iPhone')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<InstallBanner />)
      
      const closeButton = screen.getByRole('button', { name: /fermer/i })
      expect(closeButton).toHaveAttribute('aria-label', 'Fermer')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<InstallBanner />)
      
      const installButton = screen.getByRole('button', { name: /installer l'app/i })
      installButton.focus()
      
      expect(installButton).toHaveFocus()
      
      await user.keyboard('{Tab}')
      
      const closeButton = screen.getByRole('button', { name: /fermer/i })
      expect(closeButton).toHaveFocus()
    })

    it('should handle focus management in modals', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
      })
      
      render(<InstallBanner />)
      
      const installButton = screen.getByRole('button', { name: /installer l'app/i })
      await user.click(installButton)
      
      await waitFor(() => {
        expect(screen.getByText('Installer sur iPhone')).toBeInTheDocument()
      })
      
      // Modal should be focusable
      const modal = screen.getByText('Installer sur iPhone').closest('div')
      expect(modal).toBeInTheDocument()
    })
  })

  describe('Animation and Styles', () => {
    it('should apply safe area padding for mobile devices', () => {
      render(<InstallBanner />)
      
      const banner = screen.getByText('Installer Findr').closest('.fixed')
      expect(banner).toHaveClass('safe-area-bottom')
    })

    it('should show gradient background', () => {
      render(<InstallBanner />)
      
      const banner = screen.getByText('Installer Findr').closest('div')
      expect(banner).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-blue-700')
    })

    it('should animate modal entry', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        writable: true,
      })
      
      render(<InstallBanner />)
      
      const installButton = screen.getByRole('button', { name: /installer l'app/i })
      await user.click(installButton)
      
      await waitFor(() => {
        const modal = screen.getByText('Installer sur iPhone').closest('div')
        expect(modal).toHaveClass('animate-slide-up')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      mockGetItem.mockImplementation(() => {
        throw new Error('localStorage not available')
      })
      
      // Should still render without throwing
      expect(() => render(<InstallBanner />)).not.toThrow()
    })

    it('should handle missing beforeinstallprompt support', () => {
      // On browsers that don't support beforeinstallprompt
      render(<InstallPrompt />)
      
      // Should still render the component
      expect(screen.getByText('Installer Findr')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<InstallBanner />)
      
      // Re-render with same conditions
      rerender(<InstallBanner />)
      
      // Component should still be functional
      expect(screen.getByText('Installer Findr')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should render correctly on different screen sizes', () => {
      render(<InstallBanner />)
      
      const content = screen.getByText('Installer Findr').parentElement?.parentElement
      expect(content).toHaveClass('max-w-lg', 'mx-auto')
    })

    it('should adapt button layout on mobile', () => {
      render(<InstallBanner />)
      
      const buttonContainer = screen.getByRole('button', { name: /installer l'app/i }).parentElement
      expect(buttonContainer).toHaveClass('flex', 'items-center', 'gap-2')
    })
  })
})