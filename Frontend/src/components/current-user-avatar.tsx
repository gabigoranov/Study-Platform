'use client'

import { useEffect, useState } from 'react'
import { useCurrentUserImage } from '@/hooks/use-current-user-image'
import { useCurrentUserName } from '@/hooks/use-current-user-name'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function CurrentUserAvatar() {
  const currentImage = useCurrentUserImage()
  const [profile, setProfile] = useState<string | null>(null)
  const name = useCurrentUserName()

  useEffect(() => {
    setProfile(currentImage);
  }, [currentImage]) // ← runs whenever the image changes

  const initials = name
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase()

  return (
    <Avatar>
      <AvatarImage src={profile ?? undefined} alt={initials} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
