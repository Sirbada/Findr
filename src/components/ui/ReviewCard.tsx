import React from 'react'

type ReviewCardProps = {
  review: {
    id: string
    rating: number
    comment: string | null
    created_at: string
    reviewer: {
      full_name: string | null
      avatar_url: string | null
    }
  }
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Il y a 1 jour'
  if (diffDays < 30) return `Il y a ${diffDays} jours`
  if (diffDays < 60) return 'Il y a 1 mois'
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { rating, comment, created_at, reviewer } = review
  const name = reviewer.full_name || 'Utilisateur anonyme'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {reviewer.avatar_url ? (
            <img
              src={reviewer.avatar_url}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-700 font-semibold text-sm">{initials}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-medium text-gray-900 truncate">{name}</p>
            <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeDate(created_at)}</span>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg leading-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                {star <= rating ? '★' : '☆'}
              </span>
            ))}
          </div>

          {/* Comment */}
          {comment && (
            <p className="text-gray-600 text-sm leading-relaxed">{comment}</p>
          )}
        </div>
      </div>
    </div>
  )
}
