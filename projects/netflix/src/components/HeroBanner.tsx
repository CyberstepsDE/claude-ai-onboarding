import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Title } from '../data/types'
import { backdropUrl } from '../data/images'
import { useMyList } from '../hooks/useMyList'

type Props = { titles: Title[]; profileId: string; intervalMs?: number }

export function HeroBanner({ titles, profileId, intervalMs = 8000 }: Props) {
  const [i, setI] = useState(0)
  const { has, toggle } = useMyList(profileId)

  useEffect(() => {
    if (titles.length <= 1) return
    const t = setInterval(() => setI(n => (n + 1) % titles.length), intervalMs)
    return () => clearInterval(t)
  }, [titles.length, intervalMs])

  if (titles.length === 0) return null
  const title = titles[i]
  const inList = has(title.id)

  return (
    <section className="relative -mt-[72px] h-[92vh] min-h-[560px] w-full overflow-hidden">
      <img
        key={title.id}
        src={backdropUrl(title.backdropSeed)}
        alt=""
        className="fade-in absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-netflix-black to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-28 md:px-12">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="text-netflix-red font-black tracking-tighter">N</span>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">Series</span>
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl fade-in" key={title.id + '-h'}>
            {title.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-white/80">
            <span className="font-semibold text-green-400">
              {70 + (title.id.charCodeAt(1) % 30)}% Match
            </span>
            <span>{title.year}</span>
            <span className="border border-white/40 px-1.5 text-xs">{title.rating}</span>
            <span>{title.duration}</span>
          </div>
          <p className="mt-4 max-w-lg text-lg text-white/90 md:text-xl">{title.synopsis}</p>
          <div className="mt-6 flex gap-3">
            <Link
              to={`/title/${title.id}`}
              className="flex items-center gap-2 rounded bg-white px-6 py-2 font-semibold text-black hover:bg-white/85"
            >
              <PlayIcon /> Play
            </Link>
            <button
              onClick={() => toggle(title.id)}
              className="flex items-center gap-2 rounded bg-white/25 px-6 py-2 font-semibold hover:bg-white/40"
            >
              {inList ? '✓ In My List' : '+ My List'}
            </button>
            <Link
              to={`/title/${title.id}`}
              className="flex items-center gap-2 rounded bg-white/25 px-6 py-2 font-semibold hover:bg-white/40"
            >
              <InfoIcon /> More Info
            </Link>
          </div>
        </div>
      </div>

      {/* pagination dots */}
      {titles.length > 1 && (
        <div className="absolute bottom-24 right-6 z-10 flex gap-2 md:right-12">
          {titles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={
                'h-1.5 rounded-full transition-all ' +
                (idx === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70')
              }
              aria-label={`Featured ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
}
