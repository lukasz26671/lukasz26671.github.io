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
  probeStreamingProvider,
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
  /** Indeksy playlisty w kolejności odtwarzania (po current). Tylko przy shuffle. */
  queueIndices: number[]
  /** Utwory w kolejce shuffle (po current). */
  queue: Song[]
  /** Ostatnio grany utwór przed current. */
  previous: Song | null
  /** @deprecated prefer playlistName — true gdy sheet ≈ Featured */
  featured: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  setIndex: (i: number) => void
  playPrevious: () => void
  setShuffle: (v: boolean) => void
  setLoop: (v: boolean) => void
  setVolume: (v: number) => void
  setPlaylistName: (name: string) => void
  setFeatured: (v: boolean) => void
  retryCurrent: () => void
  openYoutube: () => void
  shareCurrent: () => Promise<void>
  /** Aktualny czas odtwarzania (s) — do synced lyrics */
  getCurrentTime: () => number
}

const AudioCtx = createContext<AudioContextValue | null>(null)

const VOL_KEY = 'sn-audio-volume'
const TRACK_MEMORY_KEY = 'sn-audio-track-memory'
const MAX_STREAM_RETRIES = 4
const RETRY_BASE_MS = 800
const SHUFFLE_HISTORY_MAX = 64

function readInitialVolume(): number {
  const raw = localStorage.getItem(VOL_KEY)
  if (raw == null) return 0.15
  const n = Number(raw)
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.15
}

function isSong(value: unknown): value is Song {
  if (!value || typeof value !== 'object') return false
  const s = value as Record<string, unknown>
  return (
    typeof s.id === 'string' &&
    typeof s.title === 'string' &&
    typeof s.author === 'string' &&
    typeof s.youtubeId === 'string'
  )
}

type TrackMemory = {
  current: Song | null
  previous: Song | null
}

function readTrackMemory(): TrackMemory {
  try {
    const raw = localStorage.getItem(TRACK_MEMORY_KEY)
    if (!raw) return { current: null, previous: null }
    const parsed = JSON.parse(raw) as Partial<TrackMemory>
    return {
      current: isSong(parsed.current) ? parsed.current : null,
      previous: isSong(parsed.previous) ? parsed.previous : null,
    }
  } catch {
    return { current: null, previous: null }
  }
}

function writeTrackMemory(memory: TrackMemory) {
  try {
    localStorage.setItem(TRACK_MEMORY_KEY, JSON.stringify(memory))
  } catch {
    /* ignore quota / private mode */
  }
}

function parseSongQuery(): number | null {
  const params = new URLSearchParams(window.location.search)
  const song = params.get('song')
  if (song == null) return null
  const n = Number(song)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null
}

/** Fisher–Yates bag of playlist indices, optionally excluding current track. */
function buildShuffleBag(length: number, exclude?: number): number[] {
  const bag: number[] = []
  for (let i = 0; i < length; i++) {
    if (i !== exclude) bag.push(i)
  }
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = bag[i]
    bag[i] = bag[j]
    bag[j] = tmp
  }
  return bag
}

/** Unikalne, poprawne indeksy; bez current. Max = length-1. */
function sanitizeBag(bag: number[], length: number, exclude: number): number[] {
  const seen = new Set<number>()
  const out: number[] = []
  for (const i of bag) {
    if (!Number.isInteger(i) || i < 0 || i >= length || i === exclude || seen.has(i)) {
      continue
    }
    seen.add(i)
    out.push(i)
  }
  return out
}

function pushHistory(history: number[], index: number) {
  history.push(index)
  if (history.length > SHUFFLE_HISTORY_MAX) history.shift()
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
  const [shuffleQueue, setShuffleQueue] = useState<number[]>([])
  /** Utwór spoza nowej playlisty — dalej gra, dopóki next/prev/select. */
  const [stickyCurrent, setStickyCurrent] = useState<Song | null>(null)
  const [previous, setPrevious] = useState<Song | null>(() => readTrackMemory().previous)
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
  const shuffleBagRef = useRef<number[]>([])
  const playHistoryRef = useRef<number[]>([])
  const stickyCurrentRef = useRef<Song | null>(null)
  const memoryBootRef = useRef(readTrackMemory())
  const previousRef = useRef<Song | null>(memoryBootRef.current.previous)
  const lastPlayedRef = useRef<Song | null>(memoryBootRef.current.current)
  const bootedRef = useRef(false)
  const healthFailRef = useRef(0)
  const [bootKey, setBootKey] = useState(0)

  const clearSticky = useCallback(() => {
    stickyCurrentRef.current = null
    setStickyCurrent(null)
  }, [])

  const publishQueue = useCallback(() => {
    const exclude = stickyCurrentRef.current ? -1 : indexRef.current
    const len = songsRef.current.length
    shuffleBagRef.current = sanitizeBag(shuffleBagRef.current, len, exclude)
    setShuffleQueue([...shuffleBagRef.current])
  }, [])

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

  const markServerOffline = useCallback(() => {
    wantPlayRef.current = false
    clearRetryTimer()
    stopAudioHard()
    setIsPlaying(false)
    setPlaybackIssue('none')
    clearSticky()
    setProvider(null)
    providerRef.current = null
    setSongs([])
    songsRef.current = []
    setShuffleQueue([])
    shuffleBagRef.current = []
    bootedRef.current = false
    healthFailRef.current = 0
    setStatus('unavailable')
  }, [clearRetryTimer, clearSticky, stopAudioHard])

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
        const hadPlayback = Boolean(audio.currentSrc)
        let leaving =
          stickyCurrentRef.current ??
          (hadPlayback ? list[indexRef.current] : null)
        // po refreshu: ostatnio grany utwór staje się previous
        if (
          !leaving &&
          lastPlayedRef.current &&
          lastPlayedRef.current.youtubeId !== song.youtubeId
        ) {
          leaving = lastPlayedRef.current
        }
        if (leaving && leaving.youtubeId !== song.youtubeId) {
          previousRef.current = leaving
          setPrevious(leaving)
        }
        lastPlayedRef.current = song
        writeTrackMemory({
          current: song,
          previous: previousRef.current,
        })
        clearRetryTimer()
        retryCountRef.current = 0
        setPlaybackIssue('none')
        loadGenRef.current += 1
        clearSticky()
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
        void audio.play().then(
          () => undefined,
          () => setIsPlaying(false),
        )
      }
    },
    [clearRetryTimer, clearSticky],
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

    const sticky = stickyCurrentRef.current
    const current = indexRef.current
    let nextIndex: number

    if (shuffleRef.current) {
      if (shuffleBagRef.current.length === 0) {
        shuffleBagRef.current = buildShuffleBag(
          list.length,
          sticky ? undefined : current,
        )
      }
      if (shuffleBagRef.current.length === 0) {
        nextIndex = sticky ? 0 : current
      } else {
        nextIndex = shuffleBagRef.current.shift()!
        if (!sticky) pushHistory(playHistoryRef.current, current)
      }
      applyTrack(nextIndex, true)
      publishQueue()
      return
    }

    if (sticky) {
      applyTrack(0, true)
      return
    }

    nextIndex = current + 1
    if (nextIndex >= list.length) nextIndex = 0
    applyTrack(nextIndex, true)
  }, [applyTrack, publishQueue])

  const prev = useCallback(() => {
    const list = songsRef.current
    if (list.length === 0) return
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }

    if (stickyCurrentRef.current) {
      // utwór spoza playlisty — prev tylko restart / pierwszy z nowej listy
      applyTrack(0, true)
      return
    }

    if (shuffleRef.current && playHistoryRef.current.length > 0) {
      const current = indexRef.current
      const prevIndex = playHistoryRef.current.pop()!
      shuffleBagRef.current = shuffleBagRef.current.filter((x) => x !== prevIndex && x !== current)
      shuffleBagRef.current.unshift(current)
      applyTrack(prevIndex, true)
      publishQueue()
      return
    }

    let prevIndex = indexRef.current - 1
    if (prevIndex < 0) prevIndex = list.length - 1
    applyTrack(prevIndex, true)
  }, [applyTrack, publishQueue])

  const setShuffleMode = useCallback(
    (v: boolean) => {
      setShuffle(v)
      shuffleRef.current = v
      if (v) {
        shuffleBagRef.current = buildShuffleBag(songsRef.current.length, indexRef.current)
      } else {
        shuffleBagRef.current = []
      }
      publishQueue()
    },
    [publishQueue],
  )

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

    async function loadSheet(resolved: string, sheet: string): Promise<Song[]> {
      const names = await loadPlaylistNames(resolved)
      if (cancelled) return []
      setPlaylistNames(names)

      const resolvedSheet = names.includes(sheet)
        ? sheet
        : resolveInitialPlaylistName(names)
      if (resolvedSheet !== sheet) {
        setPlaylistNameState(resolvedSheet)
        return []
      }

      const alternates = names.filter((n) => n !== resolvedSheet)
      let playlist: Song[] | null = await loadPlaylistFromSourceProvider(resolvedSheet)
      if (!playlist?.length) {
        for (const alt of alternates) {
          playlist = await loadPlaylistFromSourceProvider(alt)
          if (playlist?.length) {
            if (!cancelled) setPlaylistNameState(alt)
            return []
          }
        }
      }
      if (!playlist?.length) {
        playlist = await loadPlaylistFromJson().catch(() => [] as Song[])
      }
      return playlist ?? []
    }

    function adoptPlaylist(playlist: Song[], mode: 'boot' | 'soft') {
      const audio = audioRef.current
      const prevSong =
        stickyCurrentRef.current ?? songsRef.current[indexRef.current] ?? null
      const keepPlayback =
        mode === 'soft' && Boolean(audio?.currentSrc) && Boolean(prevSong)

      playHistoryRef.current = []
      setSongs(playlist)
      songsRef.current = playlist
      setStatus('ready')

      if (keepPlayback && prevSong) {
        const found = playlist.findIndex(
          (s) => s.youtubeId === prevSong.youtubeId || s.id === prevSong.id,
        )
        if (found >= 0) {
          stickyCurrentRef.current = null
          setStickyCurrent(null)
          setIndexState(found)
          indexRef.current = found
          if (shuffleRef.current) {
            shuffleBagRef.current = buildShuffleBag(playlist.length, found)
          } else {
            shuffleBagRef.current = []
          }
          setShuffleQueue(
            sanitizeBag(shuffleBagRef.current, playlist.length, found),
          )
          return
        }

        // Gra utwór spoza nowej playlisty — nie przerywamy
        stickyCurrentRef.current = prevSong
        setStickyCurrent(prevSong)
        setIndexState(0)
        indexRef.current = 0
        if (shuffleRef.current) {
          shuffleBagRef.current = buildShuffleBag(playlist.length)
        } else {
          shuffleBagRef.current = []
        }
        setShuffleQueue(
          sanitizeBag(shuffleBagRef.current, playlist.length, -1),
        )
        return
      }

      stickyCurrentRef.current = null
      setStickyCurrent(null)
      const q = parseSongQuery()
      let start: number
      if (mode === 'boot' && q != null && q < playlist.length) {
        start = q
      } else if (mode === 'boot' && lastPlayedRef.current) {
        const remembered = playlist.findIndex(
          (s) =>
            s.youtubeId === lastPlayedRef.current!.youtubeId ||
            s.id === lastPlayedRef.current!.id,
        )
        start =
          remembered >= 0
            ? remembered
            : Math.floor(Math.random() * playlist.length)
      } else {
        start = Math.floor(Math.random() * playlist.length)
      }
      if (shuffleRef.current) {
        shuffleBagRef.current = buildShuffleBag(playlist.length, start)
      } else {
        shuffleBagRef.current = []
      }
      applyTrack(start, false)
      setShuffleQueue(
        sanitizeBag(shuffleBagRef.current, playlist.length, start),
      )
    }

    async function boot() {
      const isInitial = !bootedRef.current
      if (isInitial) setStatus('checking')

      let resolved = providerRef.current
      if (!resolved) {
        resolved = await resolveStreamingServer()
        if (cancelled) return
        if (!resolved) {
          setStatus('unavailable')
          setProvider(null)
          if (isInitial) setSongs([])
          return
        }
        setProvider(resolved)
        providerRef.current = resolved
      }

      const playlist = await loadSheet(resolved, playlistName)
      if (cancelled || playlist.length === 0) {
        if (cancelled) return
        // rename path already triggered another effect
        if (!bootedRef.current) {
          setStatus('unavailable')
          setProvider(null)
        }
        return
      }

      adoptPlaylist(playlist, isInitial ? 'boot' : 'soft')
      bootedRef.current = true
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [playlistName, applyTrack, bootKey])

  /** Health-check: utrata serwera → wyłącz player (dock / RequireAudio). */
  useEffect(() => {
    if (status !== 'ready' || !provider) return
    let cancelled = false

    const tick = async () => {
      const ok = await probeStreamingProvider(provider)
      if (cancelled) return
      if (ok) {
        healthFailRef.current = 0
        return
      }
      healthFailRef.current += 1
      if (healthFailRef.current >= 2) {
        markServerOffline()
      }
    }

    const id = window.setInterval(() => void tick(), 12_000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [status, provider, markServerOffline])

  /** Próba powrotu gdy offline. */
  useEffect(() => {
    if (status !== 'unavailable') return
    let cancelled = false

    const tryReconnect = async () => {
      const resolved = await resolveStreamingServer()
      if (cancelled || !resolved) return
      setProvider(resolved)
      providerRef.current = resolved
      setStatus('checking')
      setBootKey((k) => k + 1)
    }

    const id = window.setInterval(() => void tryReconnect(), 20_000)
    void tryReconnect()
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [status])

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
    (i: number) => {
      const current = indexRef.current
      const list = songsRef.current
      if (list.length === 0) return
      const clamped = ((i % list.length) + list.length) % list.length
      const sticky = stickyCurrentRef.current
      if (!sticky && clamped !== current) {
        pushHistory(playHistoryRef.current, current)
        if (shuffleRef.current) {
          shuffleBagRef.current = shuffleBagRef.current.filter((x) => x !== clamped)
        }
      } else if (sticky && shuffleRef.current) {
        shuffleBagRef.current = shuffleBagRef.current.filter((x) => x !== clamped)
      }
      applyTrack(clamped, true)
      if (shuffleRef.current) publishQueue()
    },
    [applyTrack, publishQueue],
  )

  const playPrevious = useCallback(() => {
    const prevSong = previousRef.current
    if (!prevSong) return
    const list = songsRef.current
    const found = list.findIndex(
      (s) => s.youtubeId === prevSong.youtubeId || s.id === prevSong.id,
    )
    if (found >= 0) {
      setIndex(found)
      return
    }
    // spoza listy — nie da się odpalić streamem z indeksu
  }, [setIndex])

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

  const current = stickyCurrent ?? songs[index] ?? null
  /** Indeks do podświetlenia w liście — brak gdy gra sticky spoza playlisty */
  const listIndex = stickyCurrent ? -1 : index

  const queueIndices = useMemo(() => {
    if (!shuffle || songs.length === 0) return []
    return sanitizeBag(shuffleQueue, songs.length, stickyCurrent ? -1 : index)
  }, [shuffle, shuffleQueue, index, songs, stickyCurrent])

  const queue = useMemo(
    () => queueIndices.map((i) => songs[i]).filter((s): s is Song => Boolean(s)),
    [queueIndices, songs],
  )

  const openYoutube = useCallback(() => {
    if (!current) return
    window.open(youtubeUrl(current.youtubeId), '_blank', 'noopener,noreferrer')
  }, [current])

  const getCurrentTime = useCallback(() => audioRef.current?.currentTime ?? 0, [])

  const shareCurrent = useCallback(async () => {
    if (!current) return
    const url = new URL(window.location.origin)
    url.pathname = '/now-playing'
    if (!stickyCurrent) url.searchParams.set('song', String(index))
    url.searchParams.set('playlist', playlistName)
    if (featured) url.searchParams.set('featured', '1')
    try {
      await navigator.clipboard.writeText(url.toString())
    } catch {
      window.prompt('Skopiuj link:', url.toString())
    }
  }, [current, index, playlistName, featured, stickyCurrent])

  const value = useMemo<AudioContextValue>(
    () => ({
      status,
      provider,
      songs,
      index: listIndex,
      current,
      isPlaying,
      shuffle,
      loop,
      volume,
      playlistName,
      playlistNames,
      playbackIssue,
      queueIndices,
      queue,
      previous,
      featured,
      play,
      pause,
      toggle,
      next,
      prev,
      setIndex,
      playPrevious,
      setShuffle: setShuffleMode,
      setLoop,
      setVolume,
      setPlaylistName,
      setFeatured,
      retryCurrent,
      openYoutube,
      shareCurrent,
      getCurrentTime,
    }),
    [
      status,
      provider,
      songs,
      listIndex,
      current,
      isPlaying,
      shuffle,
      loop,
      volume,
      playlistName,
      playlistNames,
      playbackIssue,
      queueIndices,
      queue,
      previous,
      featured,
      play,
      pause,
      toggle,
      next,
      prev,
      setIndex,
      playPrevious,
      setShuffleMode,
      setVolume,
      setPlaylistName,
      setFeatured,
      retryCurrent,
      openYoutube,
      shareCurrent,
      getCurrentTime,
    ],
  )

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
