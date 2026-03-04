'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, CheckCircle, AlertTriangle, Clock, ArrowLeft, Loader2 } from 'lucide-react'

interface EscrowTransaction {
  id: string
  listing_id: string
  listing_type: string
  buyer_id: string
  seller_id: string
  amount: number
  platform_fee: number
  status: 'held' | 'released' | 'disputed' | 'refunded'
  payment_method: string | null
  payment_reference: string | null
  held_at: string
  released_at: string | null
  disputed_at: string | null
  dispute_reason: string | null
  created_at: string
}

function formatXAF(value: number): string {
  return value.toLocaleString('fr-FR') + ' XAF'
}

function StatusBadge({ status }: { status: EscrowTransaction['status'] }) {
  const config = {
    held: { label: 'Fonds retenus', color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-4 h-4" /> },
    released: { label: 'Libéré', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
    disputed: { label: 'En litige', color: 'bg-red-100 text-red-700', icon: <AlertTriangle className="w-4 h-4" /> },
    refunded: { label: 'Remboursé', color: 'bg-gray-100 text-gray-700', icon: <ArrowLeft className="w-4 h-4" /> },
  }
  const { label, color, icon } = config[status] || config.held
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${color}`}>
      {icon}
      {label}
    </span>
  )
}

export default function EscrowDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<EscrowTransaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDisputeForm, setShowDisputeForm] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')

  useEffect(() => {
    async function fetchTransaction() {
      if (!params.id) return
      try {
        const res = await fetch(`/api/escrow/${params.id}`)
        if (!res.ok) {
          setError('Transaction introuvable ou accès refusé.')
          setLoading(false)
          return
        }
        const data = await res.json()
        setTransaction(data.transaction)
      } catch {
        setError('Erreur lors du chargement.')
      } finally {
        setLoading(false)
      }
    }
    fetchTransaction()
  }, [params.id])

  async function handleRelease() {
    if (!transaction) return
    setActionLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/escrow/${transaction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'release' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Erreur lors de la libération des fonds.')
        return
      }
      setTransaction({ ...transaction, status: 'released', released_at: new Date().toISOString() })
    } catch {
      setError('Une erreur est survenue.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDispute(e: React.FormEvent) {
    e.preventDefault()
    if (!transaction || !disputeReason.trim()) return
    setActionLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/escrow/${transaction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dispute', reason: disputeReason }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Erreur lors de l\'ouverture du litige.')
        return
      }
      setTransaction({
        ...transaction,
        status: 'disputed',
        disputed_at: new Date().toISOString(),
        dispute_reason: disputeReason,
      })
      setShowDisputeForm(false)
    } catch {
      setError('Une erreur est survenue.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error && !transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  if (!transaction) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-8 h-8" />
              <h1 className="text-xl font-bold">Paiement Sécurisé</h1>
            </div>
            <StatusBadge status={transaction.status} />
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Amount */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Montant</span>
                <span className="font-semibold">{formatXAF(transaction.amount)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Frais plateforme (3%)</span>
                <span className="font-semibold text-orange-600">{formatXAF(transaction.platform_fee)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-bold">Total payé</span>
                <span className="font-bold text-blue-700">{formatXAF(transaction.amount + transaction.platform_fee)}</span>
              </div>
            </div>

            {/* Transaction info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Référence</span>
                <span className="font-mono text-xs text-gray-700">{transaction.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{new Date(transaction.held_at).toLocaleDateString('fr-FR')}</span>
              </div>
              {transaction.payment_method && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Méthode</span>
                  <span className="capitalize">{transaction.payment_method.replace('_', ' ')}</span>
                </div>
              )}
            </div>

            {/* Status-specific content */}
            {transaction.status === 'held' && (
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    🔒 Les fonds sont sécurisés. Confirmez la réception du bien pour libérer le paiement au vendeur.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
                )}

                {!showDisputeForm ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleRelease}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      ✓ Confirmer la réception
                    </button>
                    <button
                      onClick={() => setShowDisputeForm(true)}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 disabled:opacity-50 transition-colors text-sm"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      ⚠ Ouvrir un litige
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDispute} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Raison du litige
                      </label>
                      <textarea
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        placeholder="Décrivez le problème..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowDisputeForm(false)}
                        className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading || !disputeReason.trim()}
                        className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Soumettre le litige'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {transaction.status === 'released' && (
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                  <CheckCircle className="w-5 h-5" />
                  Fonds libérés au vendeur ✓
                </div>
                <p className="text-sm text-green-600">
                  Le paiement a été libéré le {transaction.released_at ? new Date(transaction.released_at).toLocaleDateString('fr-FR') : 'N/A'}.
                </p>
              </div>
            )}

            {transaction.status === 'disputed' && (
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  Litige en cours
                </div>
                {transaction.dispute_reason && (
                  <p className="text-sm text-red-600 mb-2">
                    <strong>Raison :</strong> {transaction.dispute_reason}
                  </p>
                )}
                <p className="text-sm text-red-600">
                  En attente de résolution admin. Notre équipe vous contactera sous 48h.
                </p>
              </div>
            )}

            {transaction.status === 'refunded' && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  Ce paiement a été remboursé.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
