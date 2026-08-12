import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card } from '../components/Card'
import { catalog } from '../data/rows'
import type { Profile } from '../data/types'

export function Genre({ profile }: { profile: Profile }) {
  const { name } = useParams()
  const genre = decodeURIComponent(name ?? '')

  const items = useMemo(
    () => catalog.filter(t => t.genres.includes(genre)),
    [genre],
  )

  return (
    <main className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12">
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-3xl font-semibold">{genre}</h1>
        <span className="text-sm text-white/50">{items.length} titles</span>
      </div>
      {items.length === 0 ? (
        <p className="text-white/70">
          Nothing here yet.{' '}
          <Link to="/" className="text-netflix-red hover:underline">Back to Home</Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map(t => (
            <Card key={t.id} title={t} profileId={profile.id} />
          ))}
        </div>
      )}
    </main>
  )
}
