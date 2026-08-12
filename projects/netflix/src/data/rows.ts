import catalogJson from './catalog.json'
import type { Title } from './types'

export const catalog = catalogJson as Title[]

export const byId = (id: string) => catalog.find(t => t.id === id)

const byIds = (ids: string[]) =>
  ids.map(id => byId(id)).filter((t): t is Title => Boolean(t))

const byGenre = (genre: string) =>
  catalog.filter(t => t.genres.includes(genre))

export const isSeries = (t: Title) => /episodes?/.test(t.duration)
export const isMovie  = (t: Title) => !isSeries(t)

export type Row = { key: string; title: string; titles: Title[]; showRank?: boolean }

export function buildRows(opts: { kidsOnly?: boolean } = {}): Row[] {
  const pool = opts.kidsOnly ? catalog.filter(t => t.kidsSafe) : catalog
  const inPool = (t: Title) => pool.includes(t)

  const trending = byIds(['t01','t06','t20','t15','t25','t35','t23','t33'])
    .filter(inPool)

  const top10 = [...pool]
    .filter(t => typeof t.top10 === 'number')
    .sort((a, b) => (a.top10! - b.top10!))
    .slice(0, 10)

  const newReleases = pool.filter(t => t.isNew)
  const latestSeries = pool.filter(isSeries).filter(t => t.isNew || (t.top10 ?? 99) <= 10)
  const popularMovies = pool.filter(isMovie).sort((a, b) => b.year - a.year).slice(0, 12)

  const action  = byGenre('Action').filter(inPool)
  const comedy  = byGenre('Comedy').filter(inPool)
  const scifi   = byGenre('Sci-Fi').filter(inPool)
  const docs    = byGenre('Documentary').filter(inPool)
  const family  = byGenre('Family').filter(inPool)
  const drama   = byGenre('Drama').filter(inPool)

  const rows: Row[] = [
    { key: 'trending',      title: 'Trending Now',                    titles: trending },
    { key: 'top10',         title: 'Top 10 in Your Country Today',    titles: top10, showRank: true },
    { key: 'latestSeries',  title: 'Latest TV Series',                titles: latestSeries },
    { key: 'new',           title: 'New Releases',                    titles: newReleases },
    { key: 'popularMovies', title: 'Popular Movies',                  titles: popularMovies },
  ]
  if (opts.kidsOnly) {
    rows.splice(1, 0, { key: 'family', title: 'Family Favorites', titles: family })
  }
  rows.push(
    { key: 'action', title: 'Adrenaline Rush',       titles: action },
    { key: 'comedy', title: 'Laugh Out Loud',        titles: comedy },
    { key: 'scifi',  title: 'Sci-Fi & Beyond',       titles: scifi },
    { key: 'drama',  title: 'Award-Winning Dramas',  titles: drama },
    { key: 'docs',   title: 'Documentaries',         titles: docs },
  )

  return rows.filter(r => r.titles.length > 0)
}

export function search(query: string): Title[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return catalog.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.synopsis.toLowerCase().includes(q) ||
    t.genres.some(g => g.toLowerCase().includes(q)) ||
    t.cast.some(c => c.toLowerCase().includes(q)),
  )
}

export const allGenres = Array.from(
  new Set(catalog.flatMap(t => t.genres)),
).sort()
