'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Search, Send, Phone, MoreVertical,
  CheckCheck, Clock, Home, Car, User, Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Demo conversations
const demoConversations = [
  {
    id: '1',
    user: {
      name: 'Marie Fotso',
      avatar: null,
      online: true,
    },
    listing: {
      title: 'Appartement 3 pièces à Bonanjo',
      type: 'housing',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100',
    },
    lastMessage: {
      text: 'Bonjour, l\'appartement est-il toujours disponible ?',
      time: '14:30',
      isRead: true,
      isMine: false,
    },
    unread: 0,
  },
  {
    id: '2',
    user: {
      name: 'Jean-Pierre Kamga',
      avatar: null,
      online: false,
    },
    listing: {
      title: 'Toyota RAV4 - Location',
      type: 'cars',
      image: 'https://images.unsplash.com/photo-1568844293986-8c1a5c14e3f7?w=100',
    },
    lastMessage: {
      text: 'D\'accord, je confirme la réservation pour samedi.',
      time: '12:15',
      isRead: false,
      isMine: true,
    },
    unread: 2,
  },
  {
    id: '3',
    user: {
      name: 'Paul Biya Jr',
      avatar: null,
      online: true,
    },
    listing: {
      title: 'Villa avec jardin à Akwa',
      type: 'housing',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100',
    },
    lastMessage: {
      text: 'Merci pour les informations !',
      time: 'Hier',
      isRead: true,
      isMine: false,
    },
    unread: 0,
  },
]

const demoMessages = [
  {
    id: '1',
    text: 'Bonjour, je suis intéressé par votre appartement à Bonanjo.',
    time: '14:00',
    isMine: false,
  },
  {
    id: '2',
    text: 'Bonjour ! Oui, l\'appartement est toujours disponible. Voulez-vous organiser une visite ?',
    time: '14:05',
    isMine: true,
  },
  {
    id: '3',
    text: 'Oui, ce serait super ! Est-ce possible ce weekend ?',
    time: '14:10',
    isMine: false,
  },
  {
    id: '4',
    text: 'Samedi à 10h vous conviendrait ?',
    time: '14:15',
    isMine: true,
  },
  {
    id: '5',
    text: 'Parfait ! Je serai là. L\'appartement est-il toujours disponible ?',
    time: '14:30',
    isMine: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1')
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState(demoMessages)
  const [searchQuery, setSearchQuery] = useState('')

  const currentConversation = demoConversations.find(c => c.id === selectedConversation)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    const message = {
      id: Date.now().toString(),
      text: newMessage,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    }
    
    setMessages([...messages, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-[#E8630A]">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="flex h-[calc(100vh-80px)]">
          {/* Conversations List */}
          <div className={`w-full md:w-96 bg-white border-r flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une conversation..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8630A]"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {demoConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 flex gap-3 hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-[#FFF4EC]' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-[#FFF4EC] rounded-full flex items-center justify-center">
                      <span className="text-[#E8630A] font-semibold">
                        {conversation.user.name.charAt(0)}
                      </span>
                    </div>
                    {conversation.user.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 truncate">
                        {conversation.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessage.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      {conversation.listing.type === 'housing' ? (
                        <Home className="w-3 h-3 text-gray-400" />
                      ) : (
                        <Car className="w-3 h-3 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-500 truncate">
                        {conversation.listing.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.isMine && (
                          <CheckCheck className={`inline w-4 h-4 mr-1 ${conversation.lastMessage.isRead ? 'text-[#E8630A]' : 'text-gray-400'}`} />
                        )}
                        {conversation.lastMessage.text}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="ml-2 bg-[#E8630A] text-white text-xs px-2 py-0.5 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation && currentConversation ? (
            <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
              {/* Chat Header */}
              <div className="bg-white border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden text-gray-600"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-[#FFF4EC] rounded-full flex items-center justify-center">
                    <span className="text-[#E8630A] font-semibold">
                      {currentConversation.user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {currentConversation.user.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {currentConversation.user.online ? (
                        <span className="text-green-600">● En ligne</span>
                      ) : (
                        'Hors ligne'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Listing Info */}
              <div className="bg-gray-50 border-b p-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={currentConversation.listing.image} 
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {currentConversation.listing.title}
                    </p>
                    <Link href="#" className="text-xs text-[#E8630A] hover:underline">
                      Voir l'annonce →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-xl px-4 py-2 ${
                        message.isMine
                          ? 'bg-[#E8630A] text-white rounded-br-md'
                          : 'bg-white border rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isMine ? 'text-white/70' : 'text-gray-400'}`}>
                        {message.time}
                        {message.isMine && <CheckCheck className="inline w-4 h-4 ml-1" />}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="bg-white border-t p-4">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E8630A]"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Vos messages
                </h3>
                <p className="text-gray-500">
                  Sélectionnez une conversation pour commencer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
