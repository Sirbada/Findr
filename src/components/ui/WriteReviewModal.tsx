'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type WriteReviewModalProps = {
  isOpen: boolean
  onClose: () => void
  revieweeId: string
  revieweeName: string
  listingId?: string
  listingType?: string
  onSuccess?: () => void
}

export function WriteReviewModal({
  isOpen,
  onClose,
  revieweeId,
  revieweeName,
  listingId,
  listingType,
  onSuccess,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Veuillez sélectionner une note.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewee_id: revieweeId,
          listing_id: listingId || null,
          listing_type: listingType || null,
          rating,
          comment: comment.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (res.status === 409) {
          setError('Vous avez déjà laissé un avis pour cet utilisateur.')
        } else if (res.status === 401) {
          setError('Vous devez être connecté pour laisser un avis.')
        } else {
          setError(data.error || 'Une erreur est survenue. Réessayez.')
        }
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        onSuccess?.()
        onClose()
        setSuccess(false)
        setRating(0)
        setComment('')
      }, 1500)
    } catch {
      setError('Erreur réseau. Réessayez.')
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setRating(0)
      setComment('')
      setError('')
      setSuccess(false)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Laisser un avis</h2>
            <p className="text-sm text-gray-500 mt-0.5">Pour {revieweeName}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-green-700 font-semibold text-lg">Avis publié avec succès!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-3xl leading-none transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span className={star <= displayRating ? 'text-yellow-400' : 'text-gray-300'}>
                      {star <= displayRating ? '★' : '☆'}
                    </span>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    {rating === 1 && 'Très mauvais'}
                    {rating === 2 && 'Mauvais'}
                    {rating === 3 && 'Correct'}
                    {rating === 4 && 'Bien'}
                    {rating === 5 && 'Excellent'}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire <span className="text-gray-400">(optionnel)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? 'Publication...' : 'Publier l\'avis'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
