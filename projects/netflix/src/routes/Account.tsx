import type { Profile } from '../data/types'
import { useContinueWatching } from '../hooks/useContinueWatching'
import { useMyList } from '../hooks/useMyList'

export function Account({ profile, onSwitch }: { profile: Profile; onSwitch: () => void }) {
  const { ids } = useMyList(profile.id)
  const { items } = useContinueWatching(profile.id)

  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 md:px-12">
      <h1 className="mb-8 text-3xl font-semibold">Account</h1>

      <section className="mb-8 rounded border border-white/10 bg-white/5 p-6">
        <div className="mb-4 text-xs uppercase tracking-widest text-white/50">Membership</div>
        <div className="flex items-baseline gap-3">
          <span className="text-xl font-semibold">Premium (mock)</span>
          <span className="text-sm text-white/60">4K + HDR · 4 screens</span>
        </div>
        <div className="mt-1 text-sm text-white/60">Next billing date — 2026-09-12 · $17.99/mo</div>
      </section>

      <section className="mb-8 rounded border border-white/10 bg-white/5 p-6">
        <div className="mb-4 text-xs uppercase tracking-widest text-white/50">Profile</div>
        <div className="flex items-center gap-4">
          <span
            className="grid h-14 w-14 place-items-center rounded font-bold text-black"
            style={{ background: profile.avatarColor }}
          >{profile.name[0]}</span>
          <div>
            <div className="text-lg font-semibold">{profile.name}{profile.isKid ? ' (Kids)' : ''}</div>
            <div className="text-sm text-white/60">
              {ids.length} in My List · {items.length} in progress
            </div>
          </div>
          <button
            onClick={onSwitch}
            className="ml-auto rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            Switch profile
          </button>
        </div>
      </section>

      <section className="rounded border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        <p>
          This is a mock account page — no real billing, subscriptions, or
          identity are tied to this demo.
        </p>
      </section>
    </main>
  )
}
