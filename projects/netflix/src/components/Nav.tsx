import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { Profile } from '../data/types'
import { NetflixLogo } from './NetflixLogo'
import { profiles as allProfiles } from '../data/profiles'
import { allGenres } from '../data/rows'

type Props = {
  profile: Profile
  onSwitch: () => void
  onPickProfile: (p: Profile) => void
}

export function Nav({ profile, onSwitch, onPickProfile }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [q, setQ] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [genreOpen, setGenreOpen] = useState(false)
  const navigate = useNavigate()
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setProfileOpen(false)
        setNotifOpen(false)
        setGenreOpen(false)
      }
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header
      ref={wrap}
      className={
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300 ' +
        (scrolled ? 'bg-netflix-black shadow-lg' : 'bg-gradient-to-b from-black/90 to-transparent')
      }
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-8 px-6 py-3 md:px-12">
        <Link to="/" className="shrink-0">
          <NetflixLogo />
        </Link>
        <nav className="hidden gap-6 text-sm text-white/80 md:flex">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/browse/series">TV Shows</NavItem>
          <NavItem to="/browse/movies">Movies</NavItem>
          <NavItem to="/browse/new">New &amp; Popular</NavItem>
          <NavItem to="/my-list">My List</NavItem>
          <div className="relative">
            <button
              onClick={() => { setGenreOpen(o => !o); setNotifOpen(false); setProfileOpen(false) }}
              className="transition hover:text-white"
            >
              Browse by Genre ▾
            </button>
            {genreOpen && (
              <div className="absolute left-0 top-full mt-2 grid w-64 grid-cols-2 gap-1 rounded border border-white/10 bg-black/95 p-2 shadow-2xl">
                {allGenres.map(g => (
                  <Link
                    key={g}
                    to={`/genre/${encodeURIComponent(g)}`}
                    onClick={() => setGenreOpen(false)}
                    className="rounded px-2 py-1 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <form onSubmit={submitSearch} className="hidden items-center md:flex">
            {showSearch ? (
              <input
                autoFocus
                value={q}
                onChange={e => setQ(e.target.value)}
                onBlur={() => q === '' && setShowSearch(false)}
                placeholder="Titles, genres, cast…"
                className="w-64 rounded border border-white/30 bg-black/60 px-3 py-1.5 text-sm placeholder-white/50 outline-none focus:border-white"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="text-white/80 hover:text-white"
                aria-label="Search"
              >🔍</button>
            )}
          </form>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); setGenreOpen(false) }}
              className="relative text-white/80 hover:text-white"
              aria-label="Notifications"
            >
              🔔
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-netflix-red text-[10px] font-bold">
                3
              </span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 divide-y divide-white/10 rounded border border-white/10 bg-black/95 shadow-2xl">
                {MOCK_NOTIFICATIONS.map((n, i) => (
                  <Link
                    to={n.href}
                    key={i}
                    onClick={() => setNotifOpen(false)}
                    className="flex gap-3 p-3 hover:bg-white/5"
                  >
                    <div className="grid h-10 w-16 shrink-0 place-items-center rounded bg-netflix-red text-lg">🎬</div>
                    <div className="text-sm">
                      <div className="font-semibold">{n.title}</div>
                      <div className="text-white/60">{n.body}</div>
                      <div className="mt-1 text-xs text-white/40">{n.when}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); setGenreOpen(false) }}
              className="flex items-center gap-2 rounded hover:opacity-90"
              title="Profile menu"
            >
              <span
                className="grid h-8 w-8 place-items-center rounded font-bold text-black"
                style={{ background: profile.avatarColor }}
              >
                {profile.name[0]}
              </span>
              <span className="hidden text-xs text-white/70 md:inline">▾</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded border border-white/10 bg-black/95 py-2 shadow-2xl">
                <div className="px-3 pb-2 text-[10px] uppercase tracking-widest text-white/40">
                  Switch profile
                </div>
                {allProfiles
                  .filter(p => p.id !== profile.id)
                  .map(p => (
                    <button
                      key={p.id}
                      onClick={() => { onPickProfile(p); setProfileOpen(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-white/5"
                    >
                      <span
                        className="grid h-7 w-7 place-items-center rounded font-bold text-black"
                        style={{ background: p.avatarColor }}
                      >{p.name[0]}</span>
                      <span>{p.name}{p.isKid ? ' (Kids)' : ''}</span>
                    </button>
                  ))}
                <div className="my-2 border-t border-white/10" />
                <button
                  onClick={() => { setProfileOpen(false); navigate('/my-list') }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                >
                  My List
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/account') }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                >
                  Account
                </button>
                <button
                  onClick={() => { setProfileOpen(false); onSwitch() }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-white/5"
                >
                  Manage Profiles
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'transition hover:text-white ' + (isActive ? 'text-white font-semibold' : '')
      }
      end
    >
      {children}
    </NavLink>
  )
}

const MOCK_NOTIFICATIONS = [
  {
    title: 'New series: Stranger Skies',
    body: 'Season 1 is now streaming.',
    when: 'Today',
    href: '/title/t01',
  },
  {
    title: 'Because you watched Neon Hunters',
    body: 'Try Zero Day — you might like it.',
    when: 'Yesterday',
    href: '/title/t35',
  },
  {
    title: 'New episodes: Crown Court',
    body: 'Two new episodes just landed.',
    when: '2 days ago',
    href: '/title/t38',
  },
]
