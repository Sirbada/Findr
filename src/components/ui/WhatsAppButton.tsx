'use client'

import { useState } from 'react'
import { MessageCircle, Phone, Copy, Check, ExternalLink } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface WhatsAppButtonProps {
  phone: string
  listingTitle: string
  listingType: 'housing' | 'cars'
  variant?: 'primary' | 'outline' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Format phone number for WhatsApp (remove spaces, add country code if needed)
function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^\d+]/g, '')
  
  // If starts with 6 or 2 (Cameroon mobile/landline), add country code
  if (cleaned.startsWith('6') || cleaned.startsWith('2')) {
    cleaned = '237' + cleaned
  }
  
  // Remove leading + if present (WhatsApp API doesn't need it)
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1)
  }
  
  return cleaned
}

// Generate WhatsApp URL with pre-filled message
function generateWhatsAppUrl(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
}

export function WhatsAppButton({
  phone,
  listingTitle,
  listingType,
  variant = 'primary',
  size = 'md',
  className = '',
}: WhatsAppButtonProps) {
  const { lang } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const content = {
    contact: lang === 'fr' ? 'Contacter via WhatsApp' : 'Contact via WhatsApp',
    contactShort: 'WhatsApp',
    call: lang === 'fr' ? 'Appeler' : 'Call',
    copy: lang === 'fr' ? 'Copier le numéro' : 'Copy number',
    copied: lang === 'fr' ? 'Copié!' : 'Copied!',
    message: lang === 'fr'
      ? `Bonjour! Je suis intéressé(e) par votre annonce "${listingTitle}" sur Findr. Est-elle toujours disponible?`
      : `Hello! I'm interested in your listing "${listingTitle}" on Findr. Is it still available?`,
  }

  const whatsappUrl = generateWhatsAppUrl(phone, content.message)
  const telUrl = `tel:${phone}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-lg
    transition-all duration-200 
    ${sizeClasses[size]}
  `

  const variantClasses = {
    primary: 'bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white',
    icon: 'bg-[#25D366] hover:bg-[#20BD5A] text-white p-2 rounded-full',
  }

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${variantClasses.icon} ${className}`}
        title={content.contact}
      >
        <MessageCircle className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      </a>
    )
  }

  return (
    <div className="relative">
      {/* Main WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClasses[variant]} ${className} w-full`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>{size === 'sm' ? content.contactShort : content.contact}</span>
        <ExternalLink className="w-4 h-4 opacity-60" />
      </a>

      {/* Quick Actions Dropdown */}
      <div className="mt-2 flex gap-2">
        {/* Call Button */}
        <a
          href={telUrl}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Phone className="w-4 h-4" />
          {content.call}
        </a>
        
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">{content.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              {content.copy}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Floating WhatsApp Button (for detail pages)
export function WhatsAppFloatingButton({
  phone,
  listingTitle,
  listingType,
}: Omit<WhatsAppButtonProps, 'variant' | 'size' | 'className'>) {
  const { lang } = useTranslation()
  
  const message = lang === 'fr'
    ? `Bonjour! Je suis intéressé(e) par votre annonce "${listingTitle}" sur Findr. Est-elle toujours disponible?`
    : `Hello! I'm interested in your listing "${listingTitle}" on Findr. Is it still available?`

  const whatsappUrl = generateWhatsAppUrl(phone, message)

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      title={lang === 'fr' ? 'Contacter via WhatsApp' : 'Contact via WhatsApp'}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}
