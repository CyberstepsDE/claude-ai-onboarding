import { useCallback, useEffect, useState } from 'react'
import type { Profile } from '../data/types'
import { profiles } from '../data/profiles'

const KEY = 'mock-netflix:profile'

export function useProfile() {
  const [profile, setProfileState] = useState<Profile | null>(() => {
    try {
      const id = localStorage.getItem(KEY)
      return profiles.find(p => p.id === id) ?? null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        setProfileState(profiles.find(p => p.id === e.newValue) ?? null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setProfile = useCallback((p: Profile | null) => {
    if (p) localStorage.setItem(KEY, p.id)
    else localStorage.removeItem(KEY)
    setProfileState(p)
  }, [])

  return { profile, setProfile, profiles }
}
