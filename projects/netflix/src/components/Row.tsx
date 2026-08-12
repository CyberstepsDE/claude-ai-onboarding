import { useRef } from 'react'
import type { Title } from '../data/types'
import { Card } from './Card'

type Props = {
  title: string
  titles: Title[]
  profileId: string
  showRank?: boolean
  progressOf?: (id: string) => number | undefined
}

export function Row({ title, titles, profileId, showRank, progressOf }: Props) {
  const scroller = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: 'smooth' })
  }

  if (titles.length === 0) return null

  return (
    <section className="relative py-4">
      <h2 className="mb-3 px-6 text-xl font-semibold md:px-12">{title}</h2>
      <div className="group relative">
        <button
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/50 opacity-0 transition group-hover:flex group-hover:opacity-100"
          aria-label="Scroll left"
        >‹</button>
        <div
          ref={scroller}
          className="no-scrollbar flex gap-3 overflow-x-visible overflow-y-visible overflow-x-auto scroll-smooth px-6 py-4 md:px-12"
        >
          {titles.map((t, i) => (
            <Card
              key={t.id}
              title={t}
              profileId={profileId}
              rank={showRank ? i + 1 : undefined}
              progress={progressOf?.(t.id)}
            />
          ))}
        </div>
        <button
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/50 opacity-0 transition group-hover:flex group-hover:opacity-100"
          aria-label="Scroll right"
        >›</button>
      </div>
    </section>
  )
}
