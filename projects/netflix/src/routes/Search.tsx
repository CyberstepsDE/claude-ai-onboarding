import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../components/Card'
import { search } from '../data/rows'
import type { Profile } from '../data/types'

export function Search({ profile }: { profile: Profile }) {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = useMemo(() => search(q), [q])

  return (
    <main className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12">
      <h1 className="mb-6 text-2xl">
        {q ? (
          <>Results for <span className="text-white/70">"{q}"</span></>
        ) : (
          'Search'
        )}
      </h1>
      {q && results.length === 0 && (
        <p className="text-white/70">
          No matches. Try a genre like "Sci-Fi" or a cast name.
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {results.map(t => (
          <Card key={t.id} title={t} profileId={profile.id} />
        ))}
      </div>
    </main>
  )
}
