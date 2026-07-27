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
  FALLBACK_PLAYLIST_NAMES,
  loadPlaylistFromJson,
  loadPlaylistFromSourceProvider,
  loadPlaylistNames,
  resolveInitialPlaylistName,
  resolveStreamingServer,
  streamUrl,
  youtubeUrl,
  type Song,
} from '../lib/audio/providers'

export type AudioStatus = 'checking' | 'ready' | 'unavailable'

export type PlaybackIssue = 'none' | 'retrying' | 'unavailable'

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
  playlistName: string
  playlistNames: string[]
  playbackIssue: PlaybackIssue
  /** @deprecated prefer playlistName — true gdy sheet ≈ Featured */
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
  setPlaylistName: (name: string) => void
  setFeatured: (v: boolean) => void
  retryCurrent: () => void
  openYoutube: () => void
  shareCurrent: () => Promise<void>
}

const AudioCtx = createContext<AudioContextValue | null>(null)

const VOL_KEY = 'sn-audio-volume'
const MAX_STREAM_RETRIES = 4
const RETRY_BASE_MS = 800

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
  const [playlistNames, setPlaylistNames] = useState<string[]>([...FALLBACK_PLAYLIST_NAMES])
  const [playlistName, setPlaylistNameState] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return (
      params.get('playlist') ?? (params.get('featured') === '1' ? 'Featured' : 'Default')
    )
  })
  const [playbackIssue, setPlaybackIssue] = useState<PlaybackIssue>('none')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const songsRef = useRef<Song[]>([])
  const indexRef = useRef(0)
  const shuffleRef = useRef(false)
  const loopRef = useRef(false)
  const providerRef = useRef<string | null>(null)
  const wantPlayRef = useRef(false)
  const retryCountRef = useRef(0)
  const retryTimerRef = useRef(0)
  const loadGenRef = useRef(0)

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
      window.clearTimeout(retryTimerRef.current)
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

  const clearRetryTimer = useCallback(() => {
    window.clearTimeout(retryTimerRef.current)
    retryTimerRef.current = 0
  }, [])

  const stopAudioHard = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
  }, [])

  const applyTrack = useCallback(
    (i: number, playAfter: boolean, opts?: { isRetry?: boolean }) => {
      const audio = audioRef.current
      const list = songsRef.current
      const prov = providerRef.current
      if (!audio || !prov || list.length === 0) return

      const clamped = ((i % list.length) + list.length) % list.length
      const song = list[clamped]
      const isRetry = opts?.isRetry === true

      if (!isRetry) {
        clearRetryTimer()
        retryCountRef.current = 0
        setPlaybackIssue('none')
        loadGenRef.current += 1
      }

      wantPlayRef.current = playAfter
      setIsPlaying(false)
      setIndexState(clamped)
      indexRef.current = clamped

      const src = streamUrl(prov, song.youtubeId)
      const bust = isRetry ? `&_retry=${retryCountRef.current}&_t=${Date.now()}` : ''
      audio.src = `${src}${bust}`
      audio.load()

      if (playAfter) {
        // isPlaying tylko po evencie `playing` — inaczej miganie selected/playing
        void audio.play().then(
          () => undefined,
          () => setIsPlaying(false),
        )
      }
    },
    [clearRetryTimer],
  )

  const scheduleRetry = useCallback(() => {
    // już zaplanowane albo limit wyczerpany
    if (retryTimerRef.current) return

    const attempt = retryCountRef.current
    if (attempt >= MAX_STREAM_RETRIES) {
      setPlaybackIssue('unavailable')
      setIsPlaying(false)
      wantPlayRef.current = false
      stopAudioHard()
      return
    }

    const delay = RETRY_BASE_MS * 2 ** attempt // 800 → 1600 → 3200 → 6400
    retryCountRef.current = attempt + 1
    setPlaybackIssue('retrying')
    setIsPlaying(false)

    const gen = loadGenRef.current
    const shouldPlay = wantPlayRef.current
    retryTimerRef.current = window.setTimeout(() => {
      retryTimerRef.current = 0
      if (gen !== loadGenRef.current) return
      applyTrack(indexRef.current, shouldPlay, { isRetry: true })
    }, delay)
  }, [applyTrack, stopAudioHard])

  const retryCurrent = useCallback(() => {
    clearRetryTimer()
    retryCountRef.current = 0
    setPlaybackIssue('retrying')
    setIsPlaying(false)
    loadGenRef.current += 1
    wantPlayRef.current = true
    applyTrack(indexRef.current, true, { isRetry: true })
  }, [applyTrack, clearRetryTimer])

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
    const onPause = () => setIsPlaying(false)
    const onPlaying = () => {
      // prawdziwy start streamu — dopiero tu sukces (nie resetuj na samym `play`)
      clearRetryTimer()
      retryCountRef.current = 0
      setPlaybackIssue('none')
      setIsPlaying(true)
    }
    const onError = () => {
      // 1 = MEDIA_ERR_ABORTED (np. po zmianie src / stopAudioHard)
      if (audio.error?.code === 1) return
      setIsPlaying(false)
      scheduleRetry()
    }

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('error', onError)
    }
  }, [clearRetryTimer, next, scheduleRetry])

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

      const names = await loadPlaylistNames(resolved)
      if (cancelled) return
      setPlaylistNames(names)

      const sheet = names.includes(playlistName)
        ? playlistName
        : resolveInitialPlaylistName(names)
      if (sheet !== playlistName) {
        setPlaylistNameState(sheet)
        return
      }

      const alternates = names.filter((n) => n !== sheet)
      let playlist: Song[] | null = await loadPlaylistFromSourceProvider(sheet)
      if (!playlist?.length) {
        for (const alt of alternates) {
          playlist = await loadPlaylistFromSourceProvider(alt)
          if (playlist?.length) {
            if (!cancelled) setPlaylistNameState(alt)
            break
          }
        }
      }
      if (!playlist?.length) {
        playlist = await loadPlaylistFromJson().catch(() => [] as Song[])
      }

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
  }, [playlistName, applyTrack])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playbackIssue === 'unavailable' || playbackIssue === 'retrying') {
      retryCurrent()
      return
    }
    wantPlayRef.current = true
    void audio.play().then(
      () => undefined,
      () => {
        setIsPlaying(false)
        scheduleRetry()
      },
    )
  }, [playbackIssue, retryCurrent, scheduleRetry])

  const pause = useCallback(() => {
    wantPlayRef.current = false
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

  const setPlaylistName = useCallback((name: string) => {
    setPlaylistNameState(name)
  }, [])

  const featured = playlistName.toLowerCase() === 'featured'

  const setFeatured = useCallback(
    (v: boolean) => {
      const featuredName =
        playlistNames.find((n) => n.toLowerCase() === 'featured') ?? 'Featured'
      const defaultName =
        playlistNames.find((n) => n === 'Default') ?? playlistNames[0] ?? 'Default'
      setPlaylistNameState(v ? featuredName : defaultName)
    },
    [playlistNames],
  )

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
    url.searchParams.set('playlist', playlistName)
    if (featured) url.searchParams.set('featured', '1')
    try {
      await navigator.clipboard.writeText(url.toString())
    } catch {
      window.prompt('Skopiuj link:', url.toString())
    }
  }, [current, index, playlistName, featured])

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
      playlistName,
      playlistNames,
      playbackIssue,
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
      setPlaylistName,
      setFeatured,
      retryCurrent,
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
      playlistName,
      playlistNames,
      playbackIssue,
      featured,
      play,
      pause,
      toggle,
      next,
      prev,
      setIndex,
      setVolume,
      setPlaylistName,
      setFeatured,
      retryCurrent,
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
