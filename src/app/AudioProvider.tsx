import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  loadPlaylistFromJson,
  loadPlaylistFromSourceProvider,
  resolveStreamingServer,
  streamUrl,
  youtubeUrl,
  type Song,
} from '../lib/audio/providers'

export type AudioStatus = 'checking' | 'ready' | 'unavailable'

type AudioContextValue = {
  status: AudioStatus
  provider: string | null
  songs: Song[]
  index: number
  current: Song | null
  isPlaying: boolean
  shuffle: boolean
  loop: boolean
  volume: number
  featured: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  setIndex: (i: number) => void
  setShuffle: (v: boolean) => void
  setLoop: (v: boolean) => void
  setVolume: (v: number) => void
  setFeatured: (v: boolean) => void
  openYoutube: () => void
  shareCurrent: () => Promise<void>
}

const AudioCtx = createContext<AudioContextValue | null>(null)

const VOL_KEY = 'sn-audio-volume'

function readInitialVolume(): number {
  const raw = localStorage.getItem(VOL_KEY)
  if (raw == null) return 0.15
  const n = Number(raw)
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.15
}

function parseSongQuery(): number | null {
  const params = new URLSearchParams(window.location.search)
  const song = params.get('song')
  if (song == null) return null
  const n = Number(song)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AudioStatus>('checking')
  const [provider, setProvider] = useState<string | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [index, setIndexState] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [loop, setLoop] = useState(false)
  const [volume, setVolumeState] = useState(readInitialVolume)
  const [featured, setFeaturedState] = useState(
    () => new URLSearchParams(window.location.search).get('featured') === '1',
  )
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const songsRef = useRef<Song[]>([])
  const indexRef = useRef(0)
  const shuffleRef = useRef(false)
  const loopRef = useRef(false)
  const providerRef = useRef<string | null>(null)

  useEffect(() => {
    songsRef.current = songs
  }, [songs])
  useEffect(() => {
    indexRef.current = index
  }, [index])
  useEffect(() => {
    shuffleRef.current = shuffle
  }, [shuffle])
  useEffect(() => {
    loopRef.current = loop
  }, [loop])
  useEffect(() => {
    providerRef.current = provider
  }, [provider])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    localStorage.setItem(VOL_KEY, String(volume))
  }, [volume])

  const applyTrack = useCallback((i: number, playAfter: boolean) => {
    const audio = audioRef.current
    const list = songsRef.current
    const prov = providerRef.current
    if (!audio || !prov || list.length === 0) return
    const clamped = ((i % list.length) + list.length) % list.length
    const song = list[clamped]
    setIndexState(clamped)
    indexRef.current = clamped
    audio.src = streamUrl(prov, song.youtubeId)
    if (playAfter) {
      void audio.play().then(
        () => setIsPlaying(true),
        () => setIsPlaying(false),
      )
    } else {
      setIsPlaying(false)
    }
  }, [])

  const next = useCallback(() => {
    const list = songsRef.current
    if (list.length === 0) return
    let nextIndex: number
    if (shuffleRef.current) {
      nextIndex = Math.floor(Math.random() * list.length)
    } else {
      nextIndex = indexRef.current + 1
      if (nextIndex >= list.length) nextIndex = 0
    }
    applyTrack(nextIndex, true)
  }, [applyTrack])

  const prev = useCallback(() => {
    const list = songsRef.current
    if (list.length === 0) return
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    let prevIndex = indexRef.current - 1
    if (prevIndex < 0) prevIndex = list.length - 1
    applyTrack(prevIndex, true)
  }, [applyTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => {
      if (loopRef.current) {
        audio.currentTime = 0
        void audio.play()
        return
      }
      next()
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [next])

  useEffect(() => {
    let cancelled = false

    async function boot() {
      setStatus('checking')
      const resolved = await resolveStreamingServer()
      if (cancelled) return
      if (!resolved) {
        setStatus('unavailable')
        setProvider(null)
        setSongs([])
        return
      }

      let playlist =
        (await loadPlaylistFromSourceProvider(featured)) ??
        (await loadPlaylistFromJson().catch(() => [] as Song[]))

      if (cancelled) return
      if (!playlist.length) {
        setStatus('unavailable')
        setProvider(null)
        return
      }

      setProvider(resolved)
      setSongs(playlist)
      songsRef.current = playlist
      providerRef.current = resolved
      setStatus('ready')

      const q = parseSongQuery()
      const start =
        q != null && q < playlist.length
          ? q
          : Math.floor(Math.random() * playlist.length)
      applyTrack(start, false)
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [featured, applyTrack])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    void audio.play().then(
      () => setIsPlaying(true),
      () => setIsPlaying(false),
    )
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, pause, play])

  const setIndex = useCallback(
    (i: number) => applyTrack(i, true),
    [applyTrack],
  )

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.min(1, Math.max(0, v)))
  }, [])

  const setFeatured = useCallback((v: boolean) => {
    setFeaturedState(v)
  }, [])

  const current = songs[index] ?? null

  const openYoutube = useCallback(() => {
    if (!current) return
    window.open(youtubeUrl(current.youtubeId), '_blank', 'noopener,noreferrer')
  }, [current])

  const shareCurrent = useCallback(async () => {
    if (!current) return
    const url = new URL(window.location.origin)
    url.pathname = '/now-playing'
    url.searchParams.set('song', String(index))
    if (featured) url.searchParams.set('featured', '1')
    try {
      await navigator.clipboard.writeText(url.toString())
    } catch {
      window.prompt('Skopiuj link:', url.toString())
    }
  }, [current, index, featured])

  const value = useMemo<AudioContextValue>(
    () => ({
      status,
      provider,
      songs,
      index,
      current,
      isPlaying,
      shuffle,
      loop,
      volume,
      featured,
      play,
      pause,
      toggle,
      next,
      prev,
      setIndex,
      setShuffle,
      setLoop,
      setVolume,
      setFeatured,
      openYoutube,
      shareCurrent,
    }),
    [
      status,
      provider,
      songs,
      index,
      current,
      isPlaying,
      shuffle,
      loop,
      volume,
      featured,
      play,
      pause,
      toggle,
      next,
      prev,
      setIndex,
      setVolume,
      setFeatured,
      openYoutube,
      shareCurrent,
    ],
  )

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
