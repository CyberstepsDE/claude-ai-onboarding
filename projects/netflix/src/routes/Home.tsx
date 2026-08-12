import { useMemo } from 'react'
import { HeroBanner } from '../components/HeroBanner'
import { Row } from '../components/Row'
import { buildRows, byId, catalog } from '../data/rows'
import type { Profile } from '../data/types'
import { useContinueWatching } from '../hooks/useContinueWatching'

export function Home({ profile }: { profile: Profile }) {
  const rows = useMemo(() => buildRows({ kidsOnly: profile.isKid }), [profile.isKid])
  const featured = useMemo(() => {
    const pool = profile.isKid ? catalog.filter(t => t.kidsSafe) : catalog
    // rotate through the top-ranked + featured pieces
    return pool.filter(t => t.featured || (t.top10 && t.top10 <= 5))
  }, [profile.isKid])

  const { items, progressOf } = useContinueWatching(profile.id)
  const continueTitles = useMemo(
    () =>
      items
        .map(p => byId(p.id))
        .filter((t): t is NonNullable<ReturnType<typeof byId>> => Boolean(t)),
    [items],
  )

  return (
    <>
      <HeroBanner titles={featured} profileId={profile.id} />
      <main className="relative z-10 -mt-32 space-y-2 pb-16">
        {continueTitles.length > 0 && (
          <Row
            title="Continue Watching"
            titles={continueTitles}
            profileId={profile.id}
            progressOf={progressOf}
          />
        )}
        {rows.map(r => (
          <Row
            key={r.key}
            title={r.title}
            titles={r.titles}
            profileId={profile.id}
            showRank={r.showRank}
          />
        ))}
      </main>
    </>
  )
}
