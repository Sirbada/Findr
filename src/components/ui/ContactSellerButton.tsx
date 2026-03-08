'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ContactSellerButtonProps {
  listingId: string
  listingType: string
  sellerId: string
  sellerPhone?: string
  listingTitle: string
  className?: string
}

export function ContactSellerButton({
  listingId,
  listingType,
  sellerId,
  sellerPhone,
  listingTitle,
  className = '',
}: ContactSellerButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleMessage = async () => {
    if (loading) return
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/chat')
        return
      }

      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          listing_type: listingType,
          seller_id: sellerId,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/chat/${data.conversation_id}`)
      } else {
        // Fallback: go to chat list
        router.push('/chat')
      }
    } catch {
      router.push('/chat')
    } finally {
      setLoading(false)
    }
  }

  const whatsappText = encodeURIComponent(
    `Bonjour, je suis intéressé par votre annonce: ${listingTitle}`
  )
  const cleanPhone = sellerPhone?.replace(/\s+/g, '').replace(/^\+/, '') || ''
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappText}`

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Message Button */}
      <button
        onClick={handleMessage}
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <MessageSquare className="w-4 h-4" />
        )}
        {loading ? 'Chargement...' : 'Message'}
      </button>

      {/* WhatsApp Button - only if phone provided */}
      {sellerPhone && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors text-sm"
        >
          <Phone className="w-4 h-4" />
          WhatsApp
        </a>
      )}
    </div>
  )
}
