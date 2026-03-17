'use client'

import { useState } from 'react'
import Link from 'next/link'
import { WriteReviewModal } from '@/components/ui/WriteReviewModal'

type ProfileActionsProps = {
  revieweeId: string
  revieweeName: string
  isLoggedIn: boolean
}

export function ProfileActions({ revieweeId, revieweeName, isLoggedIn }: ProfileActionsProps) {
  const [showReviewModal, setShowReviewModal] = useState(false)

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-green-600 text-green-700 hover:bg-green-50 font-medium rounded-xl transition-colors text-sm"
      >
        Laisser un avis
      </Link>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowReviewModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors text-sm"
      >
        ★ Laisser un avis
      </button>

      <WriteReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        revieweeId={revieweeId}
        revieweeName={revieweeName}
        onSuccess={() => {
          // Refresh the page to show the new review
          window.location.reload()
        }}
      />
    </>
  )
}
