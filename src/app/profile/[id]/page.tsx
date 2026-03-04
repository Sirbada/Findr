import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, MapPin, Calendar } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ReviewCard } from '@/components/ui/ReviewCard'
import { ProfileActions } from './ProfileActions'

type PageProps = {
  params: Promise<{ id: string }>
}

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  })
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, phone, created_at, is_verified')
    .eq('id', id)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Fetch reviews for this user
  const { data: reviewsRaw } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      reviewer:reviewer_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('reviewee_id', id)
    .order('created_at', { ascending: false })

  const reviews = (reviewsRaw || []).map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    reviewer: {
      full_name: r.reviewer?.full_name || null,
      avatar_url: r.reviewer?.avatar_url || null,
    },
  }))

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0

  // Fetch user's active properties (housing)
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, city, price_per_night, images, property_type')
    .eq('owner_id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  // Fetch user's active vehicles (cars)
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, title, city, price_per_day, images, brand')
    .eq('owner_id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  const isOwnProfile = currentUser?.id === id
  const displayName = profile.full_name || 'Utilisateur'
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const allListings = [
    ...(properties || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      city: p.city,
      price: p.price_per_night,
      priceLabel: '/nuit',
      image: p.images?.[0] || null,
      href: `/housing/${p.id}`,
      badge: p.property_type,
    })),
    ...(vehicles || []).map((v: any) => ({
      id: v.id,
      title: v.title,
      city: v.city,
      price: v.price_per_day,
      priceLabel: '/jour',
      image: v.images?.[0] || null,
      href: `/cars/${v.id}`,
      badge: v.brand,
    })),
  ].slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-50">
                    <span className="text-green-700 font-bold text-3xl">{initials}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                  {profile.is_verified && (
                    <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Vérifié
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Membre depuis {formatMemberSince(profile.created_at)}
                  </span>
                </div>

                {/* Rating Summary */}
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg leading-none ${
                            star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          {star <= Math.round(avgRating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">
                      ({reviews.length} avis)
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                {isOwnProfile ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors text-sm"
                  >
                    Modifier mon profil
                  </Link>
                ) : (
                  <ProfileActions
                    revieweeId={id}
                    revieweeName={displayName}
                    isLoggedIn={!!currentUser}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Active Listings */}
          {allListings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Annonces actives ({allListings.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={listing.href}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-40 bg-gray-100">
                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-4xl">🏠</span>
                        </div>
                      )}
                      {listing.badge && (
                        <span className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                          {listing.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-gray-900 text-sm truncate">{listing.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {listing.city}
                        </span>
                        <span className="text-sm font-bold text-green-700">
                          {formatPrice(listing.price)} XAF
                          <span className="text-xs font-normal text-gray-500">{listing.priceLabel}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Avis reçus ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-gray-500">Aucun avis pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
