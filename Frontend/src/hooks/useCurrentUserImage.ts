import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null)
  const { user } = useAuth();
  

  useEffect(() => {
    const fetchUserImage = async () => {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(`${user?.id}/avatar`);
      
      setImage(data.publicUrl);
    }
    fetchUserImage()
  }, [])

  return image
}