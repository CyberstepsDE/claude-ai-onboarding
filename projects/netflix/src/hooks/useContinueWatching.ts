import { useCallback, useEffect, useState } from 'react'

export type Progress = { id: string; percent: number; updatedAt: number }

const key = (profileId: string) => `mock-netflix:continue:${profileId}`

function read(profileId: string): Progress[] {
  try {
    const raw = localStorage.getItem(key(profileId))
    return raw ? (JSON.parse(raw) as Progress[]) : []
  } catch {
    return []
  }
}

export function useContinueWatching(profileId: string | undefined) {
  const [items, setItems] = useState<Progress[]>(() =>
    profileId ? read(profileId) : [],
  )

  useEffect(() => {
    setItems(profileId ? read(profileId) : [])
  }, [profileId])

  const persist = useCallback(
    (next: Progress[]) => {
      if (!profileId) return
      localStorage.setItem(key(profileId), JSON.stringify(next))
      setItems(next)
    },
    [profileId],
  )

  const upsert = useCallback(
    (id: string, percent: number) => {
      const now = Date.now()
      const withoutId = items.filter(p => p.id !== id)
      const capped = Math.max(0, Math.min(100, Math.round(percent)))
      // Titles at ≥95% are considered done — drop them so they don't stick around
      if (capped >= 95) {
        persist(withoutId)
        return
      }
      persist([{ id, percent: capped, updatedAt: now }, ...withoutId].slice(0, 20))
    },
    [items, persist],
  )

  const remove = useCallback(
    (id: string) => persist(items.filter(p => p.id !== id)),
    [items, persist],
  )

  const progressOf = useCallback(
    (id: string) => items.find(p => p.id === id)?.percent,
    [items],
  )

  return { items, upsert, remove, progressOf }
}
