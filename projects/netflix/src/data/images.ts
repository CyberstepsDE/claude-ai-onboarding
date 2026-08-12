// Mock image URLs. picsum.photos returns a deterministic image per seed,
// which is perfect for a mock catalog — no assets to bundle, always loads,
// and each title gets a stable poster/backdrop.

export const posterUrl = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/320/480`

export const backdropUrl = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/720`
