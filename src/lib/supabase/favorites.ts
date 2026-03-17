import { useState, useEffect } from 'react'
import { createSupabaseClient } from './client'

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!userId) {
      setFavorites(new Set())
      return
    }

    // Load user favorites from database
    const loadFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', userId)

        if (error) {
          console.error('Error loading favorites:', error)
          return
        }

        const favoriteIds = new Set(data.map(fav => fav.listing_id))
        setFavorites(favoriteIds)
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }

    loadFavorites()
  }, [userId, supabase])

  const toggle = async (listingId: string) => {
    if (!userId) return

    try {
      const isFavorite = favorites.has(listingId)

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId)

        if (!error) {
          setFavorites(prev => {
            const newSet = new Set(prev)
            newSet.delete(listingId)
            return newSet
          })
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            listing_id: listingId
          })

        if (!error) {
          setFavorites(prev => new Set([...prev, listingId]))
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return { favorites, toggle }
}