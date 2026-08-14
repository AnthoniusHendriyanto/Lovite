'use client'
import { useEffect, useRef, useState } from 'react'

export default function MusicToggle({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    return () => audio?.pause()
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
      setPlaying(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Jeda musik' : 'Putar musik'}
        className="text-primary hover:opacity-80 transition-opacity active:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-primary/10"
      >
        <span className="material-symbols-outlined text-[24px]">{playing ? 'pause' : 'music_note'}</span>
      </button>
    </>
  )
}