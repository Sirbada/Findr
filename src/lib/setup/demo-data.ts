// Demo data setup for Findr platform
// This creates realistic demo data for testing the new features

import { createClient } from '@/lib/supabase/client'

export async function setupDemoData() {
  const supabase = createClient()
  
  try {
    console.log('🚀 Setting up demo data for Findr...')

    // Create demo profiles if they don't exist
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('user_id')
      .in('user_id', ['demo-user-1', 'demo-user-2', 'demo-user-3'])

    if (!existingProfiles || existingProfiles.length === 0) {
      const demoProfiles = [
        {
          user_id: 'demo-user-1',
          full_name: 'Jean-Paul Mbarga',
          avatar_url: '/avatars/demo1.jpg',
          bio: 'Agent immobilier spécialisé dans les biens de prestige à Douala. 15 ans d\'expérience.',
          location: 'Douala, Cameroun',
          is_verified: true,
          is_pro: true,
          verification_level: 'business',
          listings_count: 12,
          rating: 4.8,
          reviews_count: 24,
          phone: '+237699123456',
          language: 'fr',
          currency: 'XAF',
          notifications_email: true,
          notifications_sms: true,
          joined_date: '2023-06-15',
          last_active: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: 'demo-user-2', 
          full_name: 'Marie Nkomo',
          avatar_url: '/avatars/demo2.jpg',
          bio: 'Propriétaire de plusieurs appartements meublés. Accueil chaleureux garanti!',
          location: 'Yaoundé, Cameroun',
          is_verified: true,
          is_pro: false,
          verification_level: 'id',
          listings_count: 3,
          rating: 4.9,
          reviews_count: 18,
          phone: '+237677987654',
          language: 'fr',
          currency: 'XAF',
          notifications_email: true,
          notifications_sms: true,
          joined_date: '2023-09-22',
          last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          user_id: 'demo-user-3',
          full_name: 'Dr. Samuel Fomba',
          avatar_url: '/avatars/demo3.jpg', 
          bio: 'Médecin vivant en France, je gère mes propriétés au Cameroun via Findr.',
          location: 'Paris, France → Bafoussam, Cameroun',
          is_verified: true,
          is_pro: false,
          verification_level: 'id',
          listings_count: 2,
          rating: 4.7,
          reviews_count: 8,
          phone: '+33612345678',
          language: 'fr',
          currency: 'EUR',
          notifications_email: true,
          notifications_sms: false,
          joined_date: '2024-01-10',
          last_active: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      const { error: profilesError } = await supabase
        .from('profiles')
        .upsert(demoProfiles, { onConflict: 'user_id' })

      if (profilesError) {
        console.error('❌ Error creating demo profiles:', profilesError)
      } else {
        console.log('✅ Demo profiles created')
      }
    }

    // Create demo reviews if they don't exist
    const { data: existingReviews } = await supabase
      .from('reviews')
      .select('id')
      .in('id', ['demo-review-1', 'demo-review-2', 'demo-review-3'])

    if (!existingReviews || existingReviews.length === 0) {
      // Get some listing IDs first
      const { data: listings } = await supabase
        .from('listings')
        .select('id, title, user_id')
        .limit(3)

      if (listings && listings.length >= 3) {
        const demoReviews = [
          {
            id: 'demo-review-1',
            reviewer_id: 'demo-user-2',
            reviewed_user_id: 'demo-user-1',
            listing_id: listings[0].id,
            rating: 5,
            title: 'Excellent service et logement parfait!',
            comment: 'Jean-Paul est un agent très professionnel. L\'appartement était exactement comme décrit, très propre et bien situé. Je recommande vivement!',
            rating_communication: 5,
            rating_accuracy: 5,
            rating_cleanliness: 5,
            rating_location: 5,
            rating_value: 4,
            is_verified: true,
            helpful_votes: 3,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          },
          {
            id: 'demo-review-2',
            reviewer_id: 'demo-user-3',
            reviewed_user_id: 'demo-user-2',
            listing_id: listings[1].id,
            rating: 5,
            title: 'Hôte exceptionnelle',
            comment: 'Marie est une hôte formidable! Très accueillante et toujours disponible. Son appartement est magnifique et parfaitement équipé.',
            rating_communication: 5,
            rating_accuracy: 5,
            rating_cleanliness: 5,
            rating_location: 4,
            rating_value: 5,
            is_verified: true,
            helpful_votes: 2,
            created_at: '2024-01-20T14:30:00Z',
            updated_at: '2024-01-20T14:30:00Z'
          },
          {
            id: 'demo-review-3',
            reviewer_id: 'demo-user-1',
            reviewed_user_id: 'demo-user-3',
            listing_id: listings[2].id,
            rating: 4,
            title: 'Bon propriétaire, communication fluide',
            comment: 'Dr. Fomba gère très bien ses biens à distance. Communication claire et rapide. Petit bémol sur l\'équipement qui pourrait être plus moderne.',
            rating_communication: 5,
            rating_accuracy: 4,
            rating_cleanliness: 4,
            rating_location: 4,
            rating_value: 4,
            is_verified: true,
            helpful_votes: 1,
            created_at: '2024-02-01T09:15:00Z',
            updated_at: '2024-02-01T09:15:00Z'
          }
        ]

        const { error: reviewsError } = await supabase
          .from('reviews')
          .upsert(demoReviews, { onConflict: 'id' })

        if (reviewsError) {
          console.error('❌ Error creating demo reviews:', reviewsError)
        } else {
          console.log('✅ Demo reviews created')
        }
      }
    }

    // Create demo booking if it doesn't exist
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('id')
      .limit(1)

    if (!existingBookings || existingBookings.length === 0) {
      const { data: listings } = await supabase
        .from('listings')
        .select('id, price, user_id')
        .eq('category', 'housing')
        .limit(1)

      if (listings && listings.length > 0) {
        const listing = listings[0]
        const monthlyRent = listing.price
        const serviceFee = Math.round(monthlyRent * 0.05)
        const depositAmount = monthlyRent * 2
        const totalAmount = monthlyRent + serviceFee + depositAmount

        const demoBooking = {
          listing_id: listing.id,
          tenant_id: 'demo-user-current',
          landlord_id: listing.user_id,
          check_in: '2026-03-01',
          check_out: '2027-02-28',
          monthly_rent: monthlyRent,
          deposit_amount: depositAmount,
          service_fee: serviceFee,
          total_amount: totalAmount,
          status: 'confirmed',
          payment_status: 'completed',
          tenant_message: 'Bonjour, je suis très intéressé par ce logement. Je suis un professionnel sérieux avec de bonnes références. Disponible pour une visite quand vous voulez.',
          landlord_response: 'Merci pour votre message. Votre profil nous convient. Nous confirmons la réservation.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error: bookingError } = await supabase
          .from('bookings')
          .insert([demoBooking])

        if (bookingError) {
          console.error('❌ Error creating demo booking:', bookingError)
        } else {
          console.log('✅ Demo booking created')
        }
      }
    }

    console.log('🎉 Demo data setup completed!')
    return true

  } catch (error) {
    console.error('❌ Error setting up demo data:', error)
    return false
  }
}

// Export individual functions for testing
export async function createDemoProfiles() {
  // Implementation moved to setupDemoData
  console.log('Use setupDemoData() instead')
}

export async function createDemoReviews() {
  // Implementation moved to setupDemoData
  console.log('Use setupDemoData() instead')
}

export async function createDemoBookings() {
  // Implementation moved to setupDemoData
  console.log('Use setupDemoData() instead')
}