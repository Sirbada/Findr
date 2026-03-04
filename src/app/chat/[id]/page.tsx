'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'

type Message = {
  id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string
}

type ConversationInfo = {
  id: string
  listing_id: string | null
  listing_type: string | null
  buyer_id: string
  seller_id: string
  other_user: { full_name: string | null; phone: string | null }
  is_buyer: boolean
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function MessageSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`h-10 bg-gray-200 rounded-2xl ${i % 2 === 0 ? 'w-48' : 'w-56'}`} />
        </div>
      ))}
    </div>
  )
}

export default function ChatDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const conversationId = params?.id

  const [userId, setUserId] = useState<string | null>(null)
  const [conversation, setConversation] = useState<ConversationInfo | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/chat')
        return
      }
      setUserId(user.id)
    }
    checkAuth()
  }, [router, supabase])

  // Load conversation info and messages
  const loadData = useCallback(async () => {
    if (!conversationId || !userId) return
    setLoading(true)

    try {
      // Get conversation details from conversations list
      const convRes = await fetch('/api/conversations')
      if (convRes.ok) {
        const convData = await convRes.json()
        const conv = (convData.conversations || []).find((c: ConversationInfo) => c.id === conversationId)
        if (conv) {
          setConversation(conv)
        } else {
          setNotFound(true)
          setLoading(false)
          return
        }
      }

      // Get messages
      const msgRes = await fetch(`/api/conversations/${conversationId}/messages`)
      if (msgRes.ok) {
        const msgData = await msgRes.json()
        setMessages(msgData.messages || [])
      } else if (msgRes.status === 403 || msgRes.status === 404) {
        setNotFound(true)
      }
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [conversationId, userId])

  useEffect(() => {
    if (userId) loadData()
  }, [userId, loadData])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId || sending) return
    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev
          return [...prev, data.message]
        })
      }
    } catch {
      setNewMessage(content)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getWhatsAppUrl = (phone: string, listingType: string | null) => {
    const text = encodeURIComponent(`Bonjour, je vous contacte via Findr concernant votre annonce ${listingType || ''}.`)
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '')
    return `https://wa.me/${cleanPhone}?text=${text}`
  }

  if (!userId && !loading) return null

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Conversation introuvable.</p>
            <Link href="/chat" className="text-green-600 hover:underline">
              Retour aux messages
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Header */}
        <div className="bg-white rounded-t-2xl border border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/chat" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-semibold text-sm">
                {(conversation?.other_user?.full_name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {conversation?.other_user?.full_name || (conversation?.is_buyer ? 'Vendeur' : 'Acheteur')}
              </p>
              {conversation?.listing_type && (
                <p className="text-xs text-gray-500 capitalize">{conversation.listing_type}</p>
              )}
            </div>
          </div>

          {/* WhatsApp Fallback */}
          {conversation?.other_user?.phone && (
            <a
              href={getWhatsAppUrl(conversation.other_user.phone, conversation.listing_type)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Continuer sur WhatsApp
            </a>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white border-x border-gray-100 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <MessageSkeleton />
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-400 text-sm">Aucun message. Dites bonjour ! 👋</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSent = msg.sender_id === userId
              return (
                <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                      isSent
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isSent ? 'text-blue-100' : 'text-gray-400'}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-2xl border border-t-0 border-gray-100 p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez un message..."
              rows={1}
              className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent max-h-32"
              style={{ minHeight: '44px' }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
              className="p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-1">Entrée pour envoyer</p>
        </div>
      </main>
    </div>
  )
}
