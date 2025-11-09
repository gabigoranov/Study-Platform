import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    const loadImage = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const url = session?.user?.user_metadata?.avatar_url ?? null
      setImage(url)

      console.log("loaded avatar");
    }

    loadImage()

    // 🔄 Subscribe to auth changes (e.g. when session restores)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const url = session?.user?.user_metadata?.avatar_url ?? null
        setImage(url)
      }
    )

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  return image
}
