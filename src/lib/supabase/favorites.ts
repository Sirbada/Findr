'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from './client'

export async function toggleFavorite(userId: string, listingId: string): Promise<boolean> {
  const supabase = createClient()

  // Check if exists
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('listing_id', listingId)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    return false // removed
  } else {
    await supabase.from('favorites').insert({ user_id: userId, listing_id: listingId })
    return true // added
  }
}

export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) setFavorites(new Set(data.map(f => f.listing_id)))
      })
  }, [userId])

  const toggle = useCallback(async (listingId: string) => {
    if (!userId) return
    const added = await toggleFavorite(userId, listingId)
    setFavorites(prev => {
      const next = new Set(prev)
      if (added) next.add(listingId)
      else next.delete(listingId)
      return next
    })
  }, [userId])

  return { favorites, toggle }
}
