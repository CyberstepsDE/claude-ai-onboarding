import { useCallback, useEffect, useState } from 'react'

const key = (profileId: string) => `mock-netflix:mylist:${profileId}`

function read(profileId: string): string[] {
  try {
    const raw = localStorage.getItem(key(profileId))
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function useMyList(profileId: string | undefined) {
  const [ids, setIds] = useState<string[]>(() =>
    profileId ? read(profileId) : [],
  )

  useEffect(() => {
    setIds(profileId ? read(profileId) : [])
  }, [profileId])

  const persist = useCallback(
    (next: string[]) => {
      if (!profileId) return
      localStorage.setItem(key(profileId), JSON.stringify(next))
      setIds(next)
    },
    [profileId],
  )

  const has = useCallback((id: string) => ids.includes(id), [ids])

  const add = useCallback(
    (id: string) => {
      if (!ids.includes(id)) persist([...ids, id])
    },
    [ids, persist],
  )

  const remove = useCallback(
    (id: string) => persist(ids.filter(x => x !== id)),
    [ids, persist],
  )

  const toggle = useCallback(
    (id: string) => (ids.includes(id) ? remove(id) : add(id)),
    [ids, add, remove],
  )

  return { ids, has, add, remove, toggle }
}
