'use client'

import { useState } from 'react'
import { Share2, Facebook, Twitter, Link2, Check, MessageCircle, Copy } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface ShareData {
  title: string
  description?: string
  url: string
  imageUrl?: string
  price?: number
  currency?: string
  location?: string
}

interface SocialShareProps {
  data: ShareData
  variant?: 'button' | 'icon' | 'full'
  className?: string
}

/**
 * Generate Open Graph meta tags for a listing
 * Use this in the layout or page head
 */
export function generateOGTags(data: ShareData) {
  const priceText = data.price 
    ? `${new Intl.NumberFormat('fr-FR').format(data.price)} ${data.currency || 'XAF'}`
    : ''
  
  return {
    'og:title': data.title,
    'og:description': data.description || `${priceText} ${data.location ? `à ${data.location}` : ''}`.trim(),
    'og:url': data.url,
    'og:image': data.imageUrl || 'https://findr.cm/og-default.jpg',
    'og:type': 'website',
    'og:site_name': 'Findr Cameroun',
    'og:locale': 'fr_FR',
    'og:locale:alternate': 'en_GB',
    // Twitter
    'twitter:card': 'summary_large_image',
    'twitter:title': data.title,
    'twitter:description': data.description,
    'twitter:image': data.imageUrl || 'https://findr.cm/og-default.jpg',
  }
}

/**
 * Translations for Social Share
 */
const shareTranslations = {
  fr: {
    share: 'Partager',
    shareOn: 'Partager sur',
    facebook: 'Facebook',
    twitter: 'Twitter',
    whatsapp: 'WhatsApp',
    copyLink: 'Copier le lien',
    copied: 'Copié!',
    shareText: 'Découvrez cette annonce sur Findr:',
    shareVia: 'Partager via',
    close: 'Fermer',
  },
  en: {
    share: 'Share',
    shareOn: 'Share on',
    facebook: 'Facebook',
    twitter: 'Twitter',
    whatsapp: 'WhatsApp',
    copyLink: 'Copy link',
    copied: 'Copied!',
    shareText: 'Check out this listing on Findr:',
    shareVia: 'Share via',
    close: 'Close',
  }
}

/**
 * Facebook Share Button
 */
export function FacebookShareButton({ 
  data, 
  className = '' 
}: { 
  data: ShareData
  className?: string 
}) {
  const { lang } = useTranslation()
  const t = shareTranslations[lang]
  
  const handleShare = () => {
    const shareUrl = encodeURIComponent(data.url)
    const text = encodeURIComponent(`${data.title}\n${t.shareText}`)
    
    // Facebook sharer URL
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${text}`
    
    // Open in popup
    window.open(
      facebookUrl,
      'facebook-share',
      'width=626,height=436,toolbar=no,menubar=no,scrollbars=yes'
    )
  }

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg transition-colors ${className}`}
      aria-label={`${t.shareOn} Facebook`}
    >
      <Facebook className="w-5 h-5" />
      <span className="font-medium">{t.facebook}</span>
    </button>
  )
}

/**
 * WhatsApp Share Button
 */
export function WhatsAppShareButton({ 
  data, 
  className = '' 
}: { 
  data: ShareData
  className?: string 
}) {
  const { lang } = useTranslation()
  const t = shareTranslations[lang]
  
  const handleShare = () => {
    const priceText = data.price 
      ? `${new Intl.NumberFormat('fr-FR').format(data.price)} ${data.currency || 'XAF'}`
      : ''
    
    const message = [
      `🏠 *${data.title}*`,
      priceText && `💰 ${priceText}`,
      data.location && `📍 ${data.location}`,
      '',
      data.description?.slice(0, 200),
      '',
      `👉 ${data.url}`
    ].filter(Boolean).join('\n')
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BD5C] text-white rounded-lg transition-colors ${className}`}
      aria-label={`${t.shareOn} WhatsApp`}
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-medium">{t.whatsapp}</span>
    </button>
  )
}

/**
 * Twitter/X Share Button
 */
export function TwitterShareButton({ 
  data, 
  className = '' 
}: { 
  data: ShareData
  className?: string 
}) {
  const { lang } = useTranslation()
  const t = shareTranslations[lang]
  
  const handleShare = () => {
    const priceText = data.price 
      ? `${new Intl.NumberFormat('fr-FR').format(data.price)} XAF`
      : ''
    
    const text = [
      data.title,
      priceText && `💰 ${priceText}`,
      data.location && `📍 ${data.location}`,
      '#Findr #Cameroun #Immobilier'
    ].filter(Boolean).join(' - ')
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.url)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors ${className}`}
      aria-label={`${t.shareOn} Twitter`}
    >
      <Twitter className="w-5 h-5" />
      <span className="font-medium">{t.twitter}</span>
    </button>
  )
}

/**
 * Copy Link Button
 */
export function CopyLinkButton({ 
  url, 
  className = '' 
}: { 
  url: string
  className?: string 
}) {
  const { lang } = useTranslation()
  const t = shareTranslations[lang]
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors ${className}`}
      aria-label={t.copyLink}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-600">{t.copied}</span>
        </>
      ) : (
        <>
          <Copy className="w-5 h-5" />
          <span className="font-medium">{t.copyLink}</span>
        </>
      )}
    </button>
  )
}

/**
 * Complete Social Share Component
 * Shows all share options
 */
export function SocialShare({ data, variant = 'button', className = '' }: SocialShareProps) {
  const { lang } = useTranslation()
  const t = shareTranslations[lang]
  const [isOpen, setIsOpen] = useState(false)

  // Use native share if available (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: data.url,
        })
        return true
      } catch (err) {
        // User cancelled or error - fall through to show modal
      }
    }
    setIsOpen(true)
    return false
  }

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleNativeShare}
          className={`p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors ${className}`}
          aria-label={t.share}
        >
          <Share2 className="w-5 h-5" />
        </button>
        
        {isOpen && (
          <ShareModal data={data} onClose={() => setIsOpen(false)} />
        )}
      </>
    )
  }

  // Button variant
  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleNativeShare}
          className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 rounded-lg transition-colors ${className}`}
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium">{t.share}</span>
        </button>
        
        {isOpen && (
          <ShareModal data={data} onClose={() => setIsOpen(false)} />
        )}
      </>
    )
  }

  // Full variant - shows all buttons inline
  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-sm font-medium text-gray-700">{t.shareVia}</p>
      <div className="flex flex-wrap gap-2">
        <FacebookShareButton data={data} />
        <WhatsAppShareButton data={data} />
        <TwitterShareButton data={data} />
        <CopyLinkButton url={data.url} />
      </div>
    </div>
  )
}

/**
 * Share Modal
 */
function ShareModal({ data, onClose }: { data: ShareData; onClose: () => void }) {
  const { lang } = useTranslation()
  const t = shareTranslations[lang]

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.shareVia}</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <FacebookShareButton data={data} className="justify-center" />
          <WhatsAppShareButton data={data} className="justify-center" />
          <TwitterShareButton data={data} className="justify-center" />
          <CopyLinkButton url={data.url} className="justify-center" />
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium"
        >
          {t.close}
        </button>
      </div>
    </div>
  )
}

/**
 * Listing Share Component
 * Pre-configured for listing detail pages
 */
interface ListingShareProps {
  listing: {
    id: string
    title: string
    description?: string | null
    price: number
    city: string
    images?: string[] | null
  }
  type: 'housing' | 'car'
  variant?: 'button' | 'icon' | 'full'
}

export function ListingShare({ listing, type, variant = 'button' }: ListingShareProps) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://findr.cm'
  
  const data: ShareData = {
    title: listing.title,
    description: listing.description || '',
    url: `${baseUrl}/${type === 'housing' ? 'housing' : 'cars'}/${listing.id}`,
    imageUrl: listing.images?.[0] || '',
    price: listing.price,
    currency: 'XAF',
    location: listing.city,
  }

  return <SocialShare data={data} variant={variant} />
}

// Add CSS for animation
const styles = `
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
`

// Inject styles if in browser
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = styles
  document.head.appendChild(styleElement)
}
