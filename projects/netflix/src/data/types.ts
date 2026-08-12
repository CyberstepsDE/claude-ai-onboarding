export type Title = {
  id: string
  title: string
  synopsis: string
  year: number
  rating: string
  duration: string
  genres: string[]
  cast: string[]
  posterSeed: string
  backdropSeed: string
  trailerUrl: string
  featured?: boolean
  top10?: number
  isNew?: boolean
  kidsSafe?: boolean
}

export type Profile = {
  id: string
  name: string
  avatarColor: string
  isKid: boolean
}
