'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Zap, ArrowLeft, LayoutDashboard } from 'lucide-react'
import { Suspense } from 'react'

function BoostSuccessContent() {
  const searchParams = useSearchParams()
  const boostId = searchParams.get('boost_id')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">Boost activé !</h1>
          <Zap className="w-6 h-6 text-yellow-500" />
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-2 text-lg">
          🎉 Votre annonce est maintenant boostée !
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Votre annonce sera mise en avant dans les résultats de recherche. 
          Le boost sera activé dès confirmation du paiement.
        </p>

        {/* Boost details */}
        {boostId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-medium text-gray-500 mb-1">Référence boost</p>
            <p className="font-mono text-sm text-gray-700 break-all">{boostId}</p>
          </div>
        )}

        {/* What happens next */}
        <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-green-800 mb-2">Ce qui se passe ensuite :</p>
          <ul className="space-y-1 text-sm text-green-700">
            <li>✓ Votre paiement est en cours de traitement</li>
            <li>✓ Votre annonce sera mise en avant sous peu</li>
            <li>✓ Vous recevrez une confirmation par SMS</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Voir mon tableau de bord
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BoostSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-20 h-20 bg-green-200 rounded-full mx-auto mb-4" />
          <div className="h-6 bg-green-200 rounded w-48 mx-auto" />
        </div>
      </div>
    }>
      <BoostSuccessContent />
    </Suspense>
  )
}
