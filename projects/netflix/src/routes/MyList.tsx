import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { byId } from '../data/rows'
import { useMyList } from '../hooks/useMyList'
import type { Profile } from '../data/types'

export function MyList({ profile }: { profile: Profile }) {
  const { ids } = useMyList(profile.id)
  const titles = ids.map(id => byId(id)).filter(Boolean)

  return (
    <main className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12">
      <h1 className="mb-6 text-3xl font-semibold">My List</h1>
      {titles.length === 0 ? (
        <div className="rounded-md border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-white/70">
            Your list is empty. Browse the <Link to="/" className="text-netflix-red hover:underline">home page</Link> and hit
            <span className="mx-1 rounded bg-white/20 px-2 py-0.5 text-sm">+ My List</span>
            on any title.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {titles.map(t => (
            <Card key={t!.id} title={t!} profileId={profile.id} />
          ))}
        </div>
      )}
    </main>
  )
}
