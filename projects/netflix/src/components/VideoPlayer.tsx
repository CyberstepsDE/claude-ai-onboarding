type Props = { src: string; poster?: string }

export function VideoPlayer({ src, poster }: Props) {
  return (
    <video
      key={src}
      className="h-full w-full bg-black"
      src={src}
      poster={poster}
      controls
      autoPlay
      playsInline
    />
  )
}
