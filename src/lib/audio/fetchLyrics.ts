import { isUnknownAuthor } from './searchLinks'
import type { Song } from './providers'

export type SyncedLyricLine = {
  time: number
  text: string
}

export type LyricsResult = {
  text: string
  /** Linie z timestampami (LRC) — mogą nie trafiać w stream 1:1 */
  synced?: SyncedLyricLine[]
  source: 'lrclib' | 'lyrics.ovh'
  artist?: string
  title?: string
}

type LrcLibHit = {
  trackName?: string
  artistName?: string
  plainLyrics?: string | null
  syncedLyrics?: string | null
  instrumental?: boolean
}

/** Parsuje LRC → posortowane linie. */
export function parseLrc(lrc: string): SyncedLyricLine[] {
  const lines: SyncedLyricLine[] = []
  for (const raw of lrc.split(/\r?\n/)) {
    const times: number[] = []
    const re = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?]/g
    let m: RegExpExecArray | null
    while ((m = re.exec(raw)) !== null) {
      const min = Number(m[1])
      const sec = Number(m[2])
      const fracRaw = m[3] ?? '0'
      const frac =
        fracRaw.length <= 2
          ? Number(fracRaw.padEnd(2, '0')) / 100
          : Number(fracRaw.padEnd(3, '0').slice(0, 3)) / 1000
      times.push(min * 60 + sec + frac)
    }
    const text = raw.replace(/\[\d{1,2}:\d{2}(?:\.\d{1,3})?]/g, '').trim()
    if (!text || times.length === 0) continue
    for (const time of times) lines.push({ time, text })
  }
  return lines.sort((a, b) => a.time - b.time)
}

export function activeSyncedIndex(lines: SyncedLyricLine[], time: number): number {
  if (lines.length === 0) return -1
  let lo = 0
  let hi = lines.length - 1
  let ans = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (lines[mid].time <= time) {
      ans = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return ans
}

async function fetchFromLrclib(song: Pick<Song, 'title' | 'author'>): Promise<LyricsResult | null> {
  const searchQ = isUnknownAuthor(song.author)
    ? song.title.trim()
    : `${song.author.trim()} ${song.title.trim()}`

  const res = await fetch(
    `https://lrclib.net/api/search?q=${encodeURIComponent(searchQ)}`,
  )
  if (!res.ok) return null

  const hits = (await res.json()) as LrcLibHit[]
  if (!Array.isArray(hits) || hits.length === 0) return null

  const titleLower = song.title.trim().toLowerCase()
  const authorLower = song.author.trim().toLowerCase()
  const ranked = [...hits].sort((a, b) => {
    const score = (h: LrcLibHit) => {
      let s = 0
      if ((h.trackName ?? '').toLowerCase() === titleLower) s += 4
      if (!isUnknownAuthor(song.author) && (h.artistName ?? '').toLowerCase().includes(authorLower))
        s += 2
      if (h.syncedLyrics?.trim()) s += 1
      if (h.plainLyrics?.trim()) s += 1
      return s
    }
    return score(b) - score(a)
  })

  const hit =
    ranked.find((h) => h.plainLyrics?.trim() || h.syncedLyrics?.trim()) ?? ranked[0]
  if (!hit) return null
  if (hit.instrumental) {
    return {
      text: '(utwór instrumentalny)',
      source: 'lrclib',
      artist: hit.artistName,
      title: hit.trackName,
    }
  }

  const synced = hit.syncedLyrics?.trim() ? parseLrc(hit.syncedLyrics) : undefined
  const text =
    hit.plainLyrics?.trim() ||
    (synced && synced.length > 0 ? synced.map((l) => l.text).join('\n') : '')
  if (!text) return null

  return {
    text,
    synced: synced && synced.length > 0 ? synced : undefined,
    source: 'lrclib',
    artist: hit.artistName,
    title: hit.trackName,
  }
}

async function fetchFromLyricsOvh(
  song: Pick<Song, 'title' | 'author'>,
): Promise<LyricsResult | null> {
  if (isUnknownAuthor(song.author)) return null
  const artist = encodeURIComponent(song.author.trim())
  const title = encodeURIComponent(song.title.trim())
  const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
  if (!res.ok) return null
  const data = (await res.json()) as { lyrics?: string }
  const text = data.lyrics?.trim()
  if (!text) return null
  return {
    text,
    source: 'lyrics.ovh',
    artist: song.author.trim(),
    title: song.title.trim(),
  }
}

/** Pobiera tekst: LRCLIB (z synced jeśli jest) → lyrics.ovh. */
export async function fetchLyrics(
  song: Pick<Song, 'title' | 'author'>,
): Promise<LyricsResult | null> {
  try {
    const fromLrc = await fetchFromLrclib(song)
    if (fromLrc) return fromLrc
  } catch {
    /* ignore */
  }
  try {
    return await fetchFromLyricsOvh(song)
  } catch {
    return null
  }
}
