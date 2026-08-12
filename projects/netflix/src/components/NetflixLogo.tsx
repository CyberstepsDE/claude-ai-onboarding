// Netflix wordmark, simplified — matches proportions of the official
// SVG closely enough to read as "Netflix" at a glance without shipping
// the actual trademarked asset.
export function NetflixLogo({ className = 'h-6 md:h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 111 30" className={className} aria-label="Netflix">
      <defs>
        <linearGradient id="nx-red" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#E50914" />
          <stop offset="100%" stopColor="#B00710" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="24"
        fontFamily="'Bebas Neue', 'Impact', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="28"
        letterSpacing="-0.5"
        fill="url(#nx-red)"
      >
        NETFLIX
      </text>
    </svg>
  )
}

export function NetflixNMark({ className = 'h-8 w-8' }: { className?: string }) {
  // Compact "N" mark for favicons / small chips
  return (
    <svg viewBox="0 0 32 32" className={className} aria-label="N">
      <rect width="32" height="32" rx="4" fill="#141414" />
      <text
        x="50%"
        y="55%"
        fontFamily="Impact, 'Arial Black', sans-serif"
        fontSize="22"
        fontWeight="900"
        fill="#E50914"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        N
      </text>
    </svg>
  )
}
