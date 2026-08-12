import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Title } from '../data/types'
import { posterUrl, backdropUrl } from '../data/images'
import { useMyList } from '../hooks/useMyList'

type Props = {
  title: Title
  profileId: string
  rank?: number
  progress?: number
}

export function Card({ title, profileId, rank, progress }: Props) {
  const navigate = useNavigate()
  const { has, toggle } = useMyList(profileId)
  const [hover, setHover] = useState(false)
  const inList = has(title.id)

  const goDetail = () => navigate(`/title/${title.id}`)
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      className="group relative shrink-0"
      style={{ width: rank ? 240 : 200 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {rank && (
        <div
          className="pointer-events-none absolute -left-4 bottom-0 z-10 select-none font-black leading-none text-black/95"
          style={{ fontSize: 160, WebkitTextStroke: '3px #E50914' }}
        >
          {rank}
        </div>
      )}

      {/* Base card — always in flow */}
      <button
        onClick={goDetail}
        className="block w-full overflow-hidden rounded-md bg-netflix-gray text-left shadow-md"
        style={{ marginLeft: rank ? 92 : 0 }}
        aria-label={title.title}
      >
        <img
          src={posterUrl(title.posterSeed)}
          alt={title.title}
          loading="lazy"
          className="aspect-[2/3] h-auto w-full object-cover"
        />
        {typeof progress === 'number' && (
          <div className="h-1 w-full bg-white/20">
            <div className="h-full bg-netflix-red" style={{ width: `${progress}%` }} />
          </div>
        )}
      </button>

      {/* Netflix-style hover pop-out — absolute, larger, with actions.
          Renders above the base card without shifting layout. */}
      {hover && (
        <div
          className="absolute left-0 top-0 z-30 hidden origin-top-left rounded-md bg-netflix-gray shadow-2xl transition-transform duration-200 md:block"
          style={{
            width: 320,
            transform: 'scale(1)',
            marginLeft: rank ? 92 : 0,
            animation: 'popIn .18s ease-out',
          }}
        >
          <button
            onClick={goDetail}
            className="block w-full overflow-hidden rounded-t-md"
            aria-label={`Open ${title.title}`}
          >
            <img
              src={backdropUrl(title.backdropSeed)}
              alt=""
              className="aspect-video w-full object-cover"
            />
          </button>
          <div className="space-y-2 p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={e => { stop(e); goDetail() }}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-black transition hover:bg-white/85"
                title="Play"
              >▶</button>
              <button
                onClick={e => { stop(e); toggle(title.id) }}
                className={
                  'grid h-9 w-9 place-items-center rounded-full border-2 transition ' +
                  (inList
                    ? 'border-white bg-white/20 text-white'
                    : 'border-white/60 text-white hover:border-white')
                }
                title={inList ? 'Remove from My List' : 'Add to My List'}
              >{inList ? '✓' : '+'}</button>
              <button
                onClick={stop}
                className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/60 text-white transition hover:border-white"
                title="Like (mock)"
              >👍</button>
              <button
                onClick={e => { stop(e); goDetail() }}
                className="ml-auto grid h-9 w-9 place-items-center rounded-full border-2 border-white/60 text-white transition hover:border-white"
                title="More info"
              >▾</button>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-green-400">
                {Math.round(70 + Math.abs(hashCode(title.id)) % 30)}% Match
              </span>
              <span className="border border-white/40 px-1">{title.rating}</span>
              <span className="text-white/70">{title.duration}</span>
              {title.isNew && (
                <span className="rounded bg-netflix-red px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  New
                </span>
              )}
            </div>
            <div className="text-sm font-semibold">{title.title}</div>
            <div className="text-xs text-white/70">
              {title.genres.slice(0, 3).join(' · ')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function hashCode(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}
