import { createClient } from './client'

export async function uploadListingImage(
  userId: string,
  file: File
): Promise<string | null> {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { error } = await supabase.storage
    .from('listing-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data } = supabase.storage.from('listing-images').getPublicUrl(fileName)
  return data.publicUrl
}

export async function deleteListingImage(path: string): Promise<boolean> {
  const supabase = createClient()
  // Extract path from full URL
  const parts = path.split('/listing-images/')
  if (parts.length < 2) return false

  const { error } = await supabase.storage.from('listing-images').remove([parts[1]])
  return !error
}
