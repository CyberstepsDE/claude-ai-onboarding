import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '../components/Card'
import { allGenres, catalog, isSeries } from '../data/rows'
import type { Profile, Title } from '../data/types'

export function Browse({ profile }: { profile: Profile }) {
  const { category } = useParams()
  const [genre, setGenre] = useState<string>('All')
  const [sort, setSort] = useState<'newest' | 'title'>('newest')

  const { heading, base } = useMemo<{ heading: string; base: Title[] }>(() => {
    if (category === 'series') return { heading: 'TV Shows', base: catalog.filter(isSeries) }
    if (category === 'movies') return { heading: 'Movies', base: catalog.filter(t => !isSeries(t)) }
    if (category === 'new')    return { heading: 'New & Popular', base: catalog.filter(t => t.isNew || t.top10) }
    return { heading: 'Browse', base: catalog }
  }, [category])

  const items = useMemo(() => {
    let out = base
    if (genre !== 'All') out = out.filter(t => t.genres.includes(genre))
    out = [...out].sort((a, b) =>
      sort === 'newest' ? b.year - a.year : a.title.localeCompare(b.title),
    )
    return out
  }, [base, genre, sort])

  return (
    <main className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12">
      <div className="mb-6 flex flex-wrap items-baseline gap-3">
        <h1 className="text-3xl font-semibold">{heading}</h1>
        <span className="text-sm text-white/50">{items.length} titles</span>
        <div className="ml-auto flex gap-2">
          <select
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="rounded border border-white/30 bg-black/60 px-3 py-1.5 text-sm"
          >
            <option value="All">All genres</option>
            {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as 'newest' | 'title')}
            className="rounded border border-white/30 bg-black/60 px-3 py-1.5 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="title">A → Z</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map(t => (
          <Card key={t.id} title={t} profileId={profile.id} />
        ))}
      </div>
    </main>
  )
}
