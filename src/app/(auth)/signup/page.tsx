'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, ArrowRight, Loader2, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function SignupPage() {
  const [method, setMethod] = useState<'phone' | 'email'>('phone')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement actual signup
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Findr</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Créer un compte
          </h1>
          <p className="mt-2 text-gray-600">
            Rejoignez Findr gratuitement
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Method Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                method === 'phone' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-4 h-4" />
              Téléphone
            </button>
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                method === 'email' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {method === 'phone' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
                    +237
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      setPhone(value)
                    }}
                    placeholder="699000000"
                    maxLength={9}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                J'accepte les{' '}
                <Link href="/terms" className="text-emerald-600 hover:underline">
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/privacy" className="text-emerald-600 hover:underline">
                  politique de confidentialité
                </Link>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              disabled={loading || !acceptTerms}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {method === 'phone' ? 'Recevoir le code' : 'Créer mon compte'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Déjà inscrit ?</span>{' '}
            <Link href="/login" className="text-emerald-600 font-medium hover:underline">
              Se connecter
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
