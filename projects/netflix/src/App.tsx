import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Nav } from './components/Nav'
import { useProfile } from './hooks/useProfile'
import { Home } from './routes/Home'
import { TitleDetail } from './routes/TitleDetail'
import { Search } from './routes/Search'
import { MyList } from './routes/MyList'
import { Browse } from './routes/Browse'
import { Genre } from './routes/Genre'
import { Account } from './routes/Account'
import { ProfilePicker } from './routes/ProfilePicker'

export default function App() {
  const { profile, setProfile } = useProfile()
  const navigate = useNavigate()

  if (!profile) {
    return (
      <Routes>
        <Route path="/profile" element={<ProfilePicker />} />
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    )
  }

  const onSwitch = () => {
    setProfile(null)
    navigate('/profile', { replace: true })
  }

  return (
    <div className="min-h-screen">
      <Nav profile={profile} onSwitch={onSwitch} onPickProfile={setProfile} />
      <Routes>
        <Route path="/" element={<Home profile={profile} />} />
        <Route path="/title/:id" element={<TitleDetail profile={profile} />} />
        <Route path="/search" element={<Search profile={profile} />} />
        <Route path="/my-list" element={<MyList profile={profile} />} />
        <Route path="/browse/:category" element={<Browse profile={profile} />} />
        <Route path="/genre/:name" element={<Genre profile={profile} />} />
        <Route path="/account" element={<Account profile={profile} onSwitch={onSwitch} />} />
        <Route path="/profile" element={<ProfilePicker />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="mx-auto max-w-[1600px] px-6 py-12 text-sm text-white/50 md:px-12">
        <div className="mb-3 text-netflix-red font-bold">NETFLIX</div>
        <p>Mock demo — trailers are public sample videos; posters are randomized placeholders. Not affiliated with Netflix, Inc.</p>
      </footer>
    </div>
  )
}
