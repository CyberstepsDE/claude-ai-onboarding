import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'

export function ProfilePicker() {
  const { profiles, setProfile } = useProfile()
  const navigate = useNavigate()

  return (
    <div className="grid min-h-screen place-items-center bg-netflix-black px-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="mb-10 text-4xl font-light text-white/90 md:text-5xl">Who's watching?</h1>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setProfile(p)
                navigate('/', { replace: true })
              }}
              className="group flex flex-col items-center gap-3"
            >
              <div
                className="grid h-28 w-28 place-items-center rounded-md text-4xl font-black text-black transition group-hover:ring-4 group-hover:ring-white md:h-36 md:w-36 md:text-5xl"
                style={{ background: p.avatarColor }}
              >
                {p.name[0]}
              </div>
              <span className="text-lg text-white/70 group-hover:text-white">
                {p.name}{p.isKid ? ' (Kids)' : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
