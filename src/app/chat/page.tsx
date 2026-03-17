'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, MessageSquare, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'

type Conversation = {
  id: string
  listing_id: string | null
  listing_type: string | null
  buyer_id: string
  seller_id: string
  last_message_at: string
  created_at: string
  latest_message: { content: string; created_at: string; sender_id: string } | null
  other_user: { full_name: string | null; phone: string | null }
  is_buyer: boolean
}

type Message = {
  id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return formatTime(ts)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

function ConversationSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
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

export default function ChatPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)
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

  // Load conversations
  const loadConversations = useCallback(async () => {
    setLoadingConvs(true)
    try {
      const res = await fetch('/api/conversations')
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations || [])
      }
    } catch {
      setConversations([])
    } finally {
      setLoadingConvs(false)
    }
  }, [])

  useEffect(() => {
    if (userId) loadConversations()
  }, [userId, loadConversations])

  // Load messages for selected conversation
  const loadMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true)
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch {
      setMessages([])
    } finally {
      setLoadingMsgs(false)
    }
  }, [])

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id)
    }
  }, [selectedConv, loadMessages])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime subscription
  useEffect(() => {
    if (!selectedConv) return

    const channel = supabase
      .channel(`messages:${selectedConv.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConv.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConv, supabase])

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv || sending) return
    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      const res = await fetch(`/api/conversations/${selectedConv.id}/messages`, {
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
        // Update conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConv.id
              ? { ...c, latest_message: { content, created_at: new Date().toISOString(), sender_id: userId! }, last_message_at: new Date().toISOString() }
              : c
          )
        )
      }
    } catch {
      // Restore message on error
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

  if (!userId && !loadingConvs) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="flex items-center text-sm text-gray-600 hover:text-green-700">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Tableau de bord
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Messages
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
          <div className="flex h-full">
            {/* Left Panel: Conversation List */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Conversations</h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingConvs ? (
                  <ConversationSkeleton />
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">Aucune conversation</p>
                    <p className="text-gray-400 text-xs mt-1">Contactez un vendeur pour démarrer</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConv(conv)}
                      className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                        selectedConv?.id === conv.id ? 'bg-green-50 border-l-2 border-l-green-500' : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-700 font-semibold text-sm">
                          {(conv.other_user?.full_name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {conv.other_user?.full_name || (conv.is_buyer ? 'Vendeur' : 'Acheteur')}
                          </p>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatDate(conv.last_message_at)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {conv.listing_type && (
                            <span className="text-green-600 mr-1">[{conv.listing_type}]</span>
                          )}
                          {conv.latest_message?.content || 'Démarrer la conversation'}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel: Message Thread */}
            <div className={`flex-1 flex flex-col ${selectedConv ? 'flex' : 'hidden md:flex'}`}>
              {!selectedConv ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-500">Sélectionnez une conversation</p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedConv(null)}
                        className="md:hidden p-1 hover:bg-gray-100 rounded-full"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-semibold text-sm">
                          {(selectedConv.other_user?.full_name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {selectedConv.other_user?.full_name || (selectedConv.is_buyer ? 'Vendeur' : 'Acheteur')}
                        </p>
                        {selectedConv.listing_type && (
                          <p className="text-xs text-gray-500 capitalize">{selectedConv.listing_type}</p>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp Fallback */}
                    {selectedConv.other_user?.phone && (
                      <a
                        href={getWhatsAppUrl(selectedConv.other_user.phone, selectedConv.listing_type)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        WhatsApp
                      </a>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loadingMsgs ? (
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
                  <div className="p-4 border-t border-gray-100">
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
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
