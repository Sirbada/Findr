'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, ArrowRight, Loader2, User, Lock, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth/context'

export default function SignupPage() {
  const router = useRouter()
  const { signUp, signUpPhone } = useAuth()
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+237')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) return
    setLoading(true)
    setError(null)

    try {
      let result
      if (signupMethod === 'phone') {
        const fullPhone = countryCode + phone
        result = await signUpPhone(fullPhone, password, name)
      } else {
        result = await signUp(email, password, name)
      }
      
      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push('/verify-email')
      }
    } catch (err) {
      setError('Erreur de connexion. Vérifiez votre connection internet.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Findr</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="mt-2 text-gray-600">Rejoignez Findr gratuitement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Tab Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setSignupMethod('email')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                signupMethod === 'email'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setSignupMethod('phone')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                signupMethod === 'phone'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Téléphone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Kamga"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {signupMethod === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="+237">🇨🇲 +237</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+1">🇺🇸 +1</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="690123456"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                J'accepte les{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">conditions d'utilisation</Link>{' '}
                et la{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">politique de confidentialité</Link>
              </label>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading || !acceptTerms}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Déjà inscrit ?</span>{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Se connecter</Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  )
}
