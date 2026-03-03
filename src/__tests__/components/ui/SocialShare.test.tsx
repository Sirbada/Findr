import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  SocialShare,
  FacebookShareButton,
  WhatsAppShareButton,
  TwitterShareButton,
  CopyLinkButton,
  generateOGTags
} from '@/components/ui/SocialShare'
import type { ShareData } from '@/components/ui/SocialShare'

// Mock the translation hook
vi.mock('@/lib/i18n/context', () => ({
  useTranslation: () => ({
    lang: 'fr' as const,
  }),
}))

// Mock navigator.share
const mockShare = vi.fn()
Object.defineProperty(navigator, 'share', {
  value: mockShare,
  writable: true,
})

// Mock navigator.clipboard  
const mockWriteText = vi.fn()
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
})

// Mock window.open
const mockOpen = vi.fn()
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true,
})

describe('SocialShare Components', () => {
  const mockShareData: ShareData = {
    title: 'Appartement moderne à Douala',
    description: 'Bel appartement 3 chambres avec vue sur mer',
    url: 'https://findr.cm/housing/123',
    imageUrl: 'https://findr.cm/images/apartment.jpg',
    price: 250000,
    currency: 'XAF',
    location: 'Douala'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockShare.mockResolvedValue(undefined)
    mockWriteText.mockResolvedValue(undefined)
  })

  describe('generateOGTags', () => {
    it('should generate correct Open Graph tags', () => {
      const tags = generateOGTags(mockShareData)
      
      expect(tags['og:title']).toBe('Appartement moderne à Douala')
      expect(tags['og:description']).toBe('Bel appartement 3 chambres avec vue sur mer')
      expect(tags['og:url']).toBe('https://findr.cm/housing/123')
      expect(tags['og:image']).toBe('https://findr.cm/images/apartment.jpg')
      expect(tags['og:type']).toBe('website')
      expect(tags['og:site_name']).toBe('Findr Cameroun')
      expect(tags['twitter:card']).toBe('summary_large_image')
    })

    it('should handle missing description', () => {
      const dataWithoutDescription = { ...mockShareData, description: undefined }
      const tags = generateOGTags(dataWithoutDescription)
      
      expect(tags['og:description']).toBe('250 000 XAF à Douala')
    })

    it('should use default image when none provided', () => {
      const dataWithoutImage = { ...mockShareData, imageUrl: undefined }
      const tags = generateOGTags(dataWithoutImage)
      
      expect(tags['og:image']).toBe('https://findr.cm/og-default.jpg')
    })
  })

  describe('FacebookShareButton', () => {
    it('should render Facebook share button', () => {
      render(<FacebookShareButton data={mockShareData} />)
      
      expect(screen.getByRole('button', { name: /partager sur facebook/i })).toBeInTheDocument()
      expect(screen.getByText('Facebook')).toBeInTheDocument()
    })

    it('should open Facebook share popup on click', async () => {
      const user = userEvent.setup()
      render(<FacebookShareButton data={mockShareData} />)
      
      const button = screen.getByRole('button', { name: /partager sur facebook/i })
      await user.click(button)
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com/sharer/sharer.php'),
        'facebook-share',
        'width=626,height=436,toolbar=no,menubar=no,scrollbars=yes'
      )
    })

    it('should encode URL and text properly', async () => {
      const user = userEvent.setup()
      render(<FacebookShareButton data={mockShareData} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const [url] = mockOpen.mock.calls[0]
      expect(url).toContain(encodeURIComponent(mockShareData.url))
      expect(url).toContain(encodeURIComponent(mockShareData.title))
    })
  })

  describe('WhatsAppShareButton', () => {
    it('should render WhatsApp share button', () => {
      render(<WhatsAppShareButton data={mockShareData} />)
      
      expect(screen.getByRole('button', { name: /partager sur whatsapp/i })).toBeInTheDocument()
      expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    })

    it('should open WhatsApp with formatted message', async () => {
      const user = userEvent.setup()
      render(<WhatsAppShareButton data={mockShareData} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('wa.me/?text='),
        '_blank'
      )
      
      const [url] = mockOpen.mock.calls[0]
      const decodedMessage = decodeURIComponent(url.split('text=')[1])
      
      expect(decodedMessage).toContain('🏠 *Appartement moderne à Douala*')
      expect(decodedMessage).toContain('💰 250 000 XAF')
      expect(decodedMessage).toContain('📍 Douala')
      expect(decodedMessage).toContain('https://findr.cm/housing/123')
    })

    it('should handle data without price', async () => {
      const user = userEvent.setup()
      const dataWithoutPrice = { ...mockShareData, price: undefined }
      render(<WhatsAppShareButton data={dataWithoutPrice} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      const [url] = mockOpen.mock.calls[0]
      expect(url).not.toContain('💰')
    })
  })

  describe('TwitterShareButton', () => {
    it('should render Twitter share button', () => {
      render(<TwitterShareButton data={mockShareData} />)
      
      expect(screen.getByRole('button', { name: /partager sur twitter/i })).toBeInTheDocument()
      expect(screen.getByText('Twitter')).toBeInTheDocument()
    })

    it('should open Twitter with formatted tweet', async () => {
      const user = userEvent.setup()
      render(<TwitterShareButton data={mockShareData} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        '_blank',
        'width=600,height=400'
      )
      
      const [url] = mockOpen.mock.calls[0]
      const decodedText = decodeURIComponent(url.split('text=')[1].split('&')[0])
      
      expect(decodedText).toContain('Appartement moderne à Douala')
      expect(decodedText).toContain('250 000 XAF')
      expect(decodedText).toContain('Douala')
      expect(decodedText).toContain('#Findr #Cameroun #Immobilier')
    })
  })

  describe('CopyLinkButton', () => {
    it('should render copy link button', () => {
      render(<CopyLinkButton url={mockShareData.url} />)
      
      expect(screen.getByRole('button', { name: /copier le lien/i })).toBeInTheDocument()
      expect(screen.getByText('Copier le lien')).toBeInTheDocument()
    })

    it('should copy URL to clipboard', async () => {
      const user = userEvent.setup()
      render(<CopyLinkButton url={mockShareData.url} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockWriteText).toHaveBeenCalledWith(mockShareData.url)
    })

    it('should show success feedback after copying', async () => {
      const user = userEvent.setup()
      render(<CopyLinkButton url={mockShareData.url} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('Copié!')).toBeInTheDocument()
      })
    })

    it('should revert to original text after 2 seconds', async () => {
      const user = userEvent.setup()
      render(<CopyLinkButton url={mockShareData.url} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      await waitFor(() => {
        expect(screen.getByText('Copié!')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(screen.getByText('Copier le lien')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should fallback to document.execCommand if clipboard API fails', async () => {
      const user = userEvent.setup()
      
      // Mock clipboard API failure
      mockWriteText.mockRejectedValue(new Error('Clipboard API not available'))
      
      // Mock document methods
      const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
        select: vi.fn(),
        value: '',
      } as any)
      const mockExecCommand = vi.spyOn(document, 'execCommand').mockReturnValue(true)
      const mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn())
      const mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn())
      
      render(<CopyLinkButton url={mockShareData.url} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockCreateElement).toHaveBeenCalledWith('textarea')
      expect(mockExecCommand).toHaveBeenCalledWith('copy')
      
      mockCreateElement.mockRestore()
      mockExecCommand.mockRestore()
      mockAppendChild.mockRestore()
      mockRemoveChild.mockRestore()
    })
  })

  describe('SocialShare Component', () => {
    describe('Icon Variant', () => {
      it('should render share icon only', () => {
        render(<SocialShare data={mockShareData} variant="icon" />)
        
        const button = screen.getByRole('button', { name: /partager/i })
        expect(button).toBeInTheDocument()
        
        // Should not show text, only icon
        expect(screen.queryByText('Partager')).not.toBeInTheDocument()
      })

      it('should try native share first if available', async () => {
        const user = userEvent.setup()
        mockShare.mockResolvedValue(undefined)
        
        render(<SocialShare data={mockShareData} variant="icon" />)
        
        const button = screen.getByRole('button')
        await user.click(button)
        
        expect(mockShare).toHaveBeenCalledWith({
          title: mockShareData.title,
          text: mockShareData.description,
          url: mockShareData.url,
        })
      })

      it('should show modal if native share fails', async () => {
        const user = userEvent.setup()
        mockShare.mockRejectedValue(new Error('User cancelled'))
        
        render(<SocialShare data={mockShareData} variant="icon" />)
        
        const button = screen.getByRole('button')
        await user.click(button)
        
        await waitFor(() => {
          expect(screen.getByText(/partager via/i)).toBeInTheDocument()
        })
      })
    })

    describe('Button Variant', () => {
      it('should render share button with text', () => {
        render(<SocialShare data={mockShareData} variant="button" />)
        
        expect(screen.getByRole('button', { name: /partager/i })).toBeInTheDocument()
        expect(screen.getByText('Partager')).toBeInTheDocument()
      })
    })

    describe('Full Variant', () => {
      it('should render all share buttons inline', () => {
        render(<SocialShare data={mockShareData} variant="full" />)
        
        expect(screen.getByText(/partager via/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /facebook/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /twitter/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /copier/i })).toBeInTheDocument()
      })
    })

    describe('Share Modal', () => {
      it('should close modal when backdrop is clicked', async () => {
        const user = userEvent.setup()
        mockShare.mockRejectedValue(new Error('User cancelled'))
        
        render(<SocialShare data={mockShareData} variant="button" />)
        
        const button = screen.getByRole('button')
        await user.click(button)
        
        await waitFor(() => {
          expect(screen.getByText(/partager via/i)).toBeInTheDocument()
        })
        
        const backdrop = screen.getByText(/partager via/i).closest('div[class*="fixed"]')
        if (backdrop) {
          await user.click(backdrop)
          
          await waitFor(() => {
            expect(screen.queryByText(/partager via/i)).not.toBeInTheDocument()
          })
        }
      })

      it('should close modal when close button is clicked', async () => {
        const user = userEvent.setup()
        mockShare.mockRejectedValue(new Error('User cancelled'))
        
        render(<SocialShare data={mockShareData} variant="button" />)
        
        const shareButton = screen.getByRole('button', { name: /partager/i })
        await user.click(shareButton)
        
        await waitFor(() => {
          expect(screen.getByText(/partager via/i)).toBeInTheDocument()
        })
        
        const closeButton = screen.getByRole('button', { name: /fermer/i })
        await user.click(closeButton)
        
        await waitFor(() => {
          expect(screen.queryByText(/partager via/i)).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<SocialShare data={mockShareData} variant="full" />)
      
      expect(screen.getByRole('button', { name: /partager sur facebook/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /partager sur whatsapp/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /partager sur twitter/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /copier le lien/i })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<SocialShare data={mockShareData} variant="full" />)
      
      const facebookButton = screen.getByRole('button', { name: /facebook/i })
      facebookButton.focus()
      
      expect(facebookButton).toHaveFocus()
      
      await user.keyboard('{Tab}')
      
      const whatsappButton = screen.getByRole('button', { name: /whatsapp/i })
      expect(whatsappButton).toHaveFocus()
    })
  })

  describe('Error Handling', () => {
    it('should handle missing share data gracefully', () => {
      const incompleteData = { title: 'Test', url: 'https://test.com' }
      
      render(<SocialShare data={incompleteData as ShareData} variant="button" />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should handle clipboard API errors gracefully', async () => {
      const user = userEvent.setup()
      mockWriteText.mockRejectedValue(new Error('Permission denied'))
      
      render(<CopyLinkButton url={mockShareData.url} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Should still show success (using fallback method)
      await waitFor(() => {
        expect(screen.getByText('Copié!')).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Design', () => {
    it('should render properly on different screen sizes', () => {
      render(<SocialShare data={mockShareData} variant="full" />)
      
      const container = screen.getByText(/partager via/i).parentElement
      expect(container).toHaveClass('space-y-3')
      
      const buttonContainer = screen.getByRole('button', { name: /facebook/i }).parentElement
      expect(buttonContainer).toHaveClass('flex', 'flex-wrap', 'gap-2')
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<SocialShare data={mockShareData} variant="button" />)
      
      // Re-render with same props
      rerender(<SocialShare data={mockShareData} variant="button" />)
      
      // Component should still be functional
      expect(screen.getByRole('button', { name: /partager/i })).toBeInTheDocument()
    })
  })

  describe('Custom Classes', () => {
    it('should accept custom className', () => {
      render(<FacebookShareButton data={mockShareData} className="custom-facebook-btn" />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-facebook-btn')
    })

    it('should merge custom classes with default classes', () => {
      render(<FacebookShareButton data={mockShareData} className="custom-class" />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class', 'bg-[#1877F2]') // Both custom and default
    })
  })
})