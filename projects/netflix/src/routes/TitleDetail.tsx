import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { backdropUrl } from '../data/images'
import { byId, catalog } from '../data/rows'
import { useMyList } from '../hooks/useMyList'
import { useContinueWatching } from '../hooks/useContinueWatching'
import type { Profile } from '../data/types'
import { Row } from '../components/Row'

export function TitleDetail({ profile }: { profile: Profile }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const title = id ? byId(id) : undefined
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { has, toggle } = useMyList(profile.id)
  const { upsert, progressOf } = useContinueWatching(profile.id)
  const savedProgress = title ? progressOf(title.id) : undefined

  const moreLikeThis = useMemo(() => {
    if (!title) return []
    return catalog
      .filter(t => t.id !== title.id && t.genres.some(g => title.genres.includes(g)))
      .slice(0, 12)
  }, [title])

  // Persist watch progress every ~2s while the trailer is playing.
  useEffect(() => {
    if (!playing || !title) return
    const el = videoRef.current
    if (!el) return
    const tick = () => {
      if (!el.duration || Number.isNaN(el.duration)) return
      const pct = (el.currentTime / el.duration) * 100
      upsert(title.id, pct)
    }
    const interval = setInterval(tick, 2000)
    return () => clearInterval(interval)
  }, [playing, title, upsert])

  // Resume where the user left off
  useEffect(() => {
    if (!playing || !title || savedProgress == null) return
    const el = videoRef.current
    if (!el) return
    const setStart = () => {
      if (el.duration && !Number.isNaN(el.duration)) {
        el.currentTime = (savedProgress / 100) * el.duration
      }
    }
    if (el.readyState >= 1) setStart()
    else el.addEventListener('loadedmetadata', setStart, { once: true })
  }, [playing, title, savedProgress])

  if (!title) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <h1 className="mb-2 text-2xl">Title not found</h1>
          <Link to="/" className="text-netflix-red hover:underline">Back to Home</Link>
        </div>
      </div>
    )
  }

  const inList = has(title.id)

  return (
    <div className="pb-16 pt-[72px]">
      <div className="relative">
        {playing ? (
          <div className="relative mx-auto aspect-video max-w-[1200px] bg-black">
            <video
              ref={videoRef}
              className="h-full w-full bg-black"
              src={title.trailerUrl}
              poster={backdropUrl(title.backdropSeed)}
              controls
              autoPlay
              muted={muted}
              playsInline
            />
            <button
              onClick={() => setMuted(m => !m)}
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white/90 hover:bg-black"
              title={muted ? 'Unmute' : 'Mute'}
            >{muted ? '🔇' : '🔊'}</button>
          </div>
        ) : (
          <div className="relative h-[65vh] min-h-[420px] w-full overflow-hidden">
            <img src={backdropUrl(title.backdropSeed)} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-netflix-black to-transparent" />
            <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-16 md:px-12">
              <button onClick={() => navigate(-1)} className="mb-4 self-start text-sm text-white/70 hover:text-white">
                ← Back
              </button>
              <h1 className="max-w-2xl text-4xl font-black md:text-6xl">{title.title}</h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-white/80">
                <span className="text-green-400 font-semibold">
                  {Math.round(70 + Math.abs(hashCode(title.id)) % 30)}% Match
                </span>
                <span>{title.year}</span>
                <span className="border border-white/40 px-1.5 text-xs">{title.rating}</span>
                <span>{title.duration}</span>
                {title.isNew && (
                  <span className="rounded bg-netflix-red px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">New</span>
                )}
              </div>
              {savedProgress != null && (
                <div className="mt-4 max-w-md">
                  <div className="mb-1 text-xs text-white/60">Resume at {savedProgress}%</div>
                  <div className="h-1 w-full bg-white/20">
                    <div className="h-full bg-netflix-red" style={{ width: `${savedProgress}%` }} />
                  </div>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setPlaying(true)}
                  className="flex items-center gap-2 rounded bg-white px-6 py-2 font-semibold text-black hover:bg-white/85"
                >
                  ▶ {savedProgress != null ? 'Resume' : 'Play Trailer'}
                </button>
                <button
                  onClick={() => toggle(title.id)}
                  className={
                    'flex items-center gap-2 rounded px-6 py-2 font-semibold ' +
                    (inList ? 'bg-white/20 hover:bg-white/30' : 'bg-white/25 hover:bg-white/40')
                  }
                >
                  {inList ? '✓ In My List' : '+ My List'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-8 px-6 pt-8 md:grid-cols-3 md:px-12">
        <div className="md:col-span-2">
          <p className="text-lg text-white/90">{title.synopsis}</p>
        </div>
        <div className="space-y-2 text-sm text-white/80">
          <div>
            <span className="text-white/50">Cast: </span>
            {title.cast.join(', ')}
          </div>
          <div>
            <span className="text-white/50">Genres: </span>
            {title.genres.map((g, i) => (
              <span key={g}>
                {i > 0 && ', '}
                <Link to={`/genre/${encodeURIComponent(g)}`} className="hover:text-white hover:underline">
                  {g}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>

      {moreLikeThis.length > 0 && (
        <div className="mt-10">
          <Row title="More Like This" titles={moreLikeThis} profileId={profile.id} />
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
