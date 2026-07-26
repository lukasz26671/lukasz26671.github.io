export const STREAMING_PROVIDERS = [
  'https://lukasz26671.duckdns.org:9975',
] as const

export const SOURCE_PROVIDER = 'https://lukasz26671.duckdns.org:9975'

export const HEALTH_TIMEOUT_MS = 4500

export const FALLBACK_PLAYLIST_NAMES = ['Default', 'Featured'] as const

export type Song = {
  id: string
  title: string
  author: string
  youtubeId: string
}

export type PlaylistPayload = {
  authors: string[]
  titles: string[]
  IDs: string[]
}

type SongsJson = {
  streamingSongs?: {
    ID: string[]
    names: string[]
    authors: string[]
  }
}

type ApiSong = {
  title: string
  author: string
  youtubeId: string
}

type StreamUrlResponse = {
  result: string
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms)
    promise.then(
      (v) => {
        clearTimeout(t)
        resolve(v)
      },
      (e) => {
        clearTimeout(t)
        reject(e)
      },
    )
  })
}

export async function probeStreamingProvider(
  url: string,
  timeoutMs = HEALTH_TIMEOUT_MS,
): Promise<boolean> {
  try {
    const res = await withTimeout(
      fetch(`${url}/_health`, { method: 'GET', mode: 'cors' }),
      timeoutMs,
    )
    return res.ok
  } catch {
    return false
  }
}

export async function resolveStreamingServer(): Promise<string | null> {
  for (const provider of STREAMING_PROVIDERS) {
    const ok = await probeStreamingProvider(provider)
    if (ok) return provider
  }
  return null
}

function zipSongs(authors: string[], titles: string[], ids: string[]): Song[] {
  const len = Math.min(authors.length, titles.length, ids.length)
  const out: Song[] = []
  for (let i = 0; i < len; i++) {
    out.push({
      id: `${ids[i]}-${i}`,
      author: authors[i],
      title: titles[i],
      youtubeId: ids[i],
    })
  }
  return out
}

function apiSongsToPlaylistPayload(songs: ApiSong[]): PlaylistPayload {
  return {
    authors: songs.map((s) => s.author),
    titles: songs.map((s) => s.title),
    IDs: songs.map((s) => s.youtubeId),
  }
}

export async function loadPlaylistFromJson(): Promise<Song[]> {
  const res = await fetch('/songs.json')
  if (!res.ok) throw new Error('songs.json unavailable')
  const data = (await res.json()) as SongsJson
  const s = data.streamingSongs
  if (!s) return []
  return zipSongs(s.authors, s.names, s.ID)
}

/** Nazwy sheetów z Google Sheets (bez __INFO). */
export async function loadPlaylistNames(
  baseUrl: string = SOURCE_PROVIDER,
): Promise<string[]> {
  try {
    const res = await withTimeout(
      fetch(`${baseUrl}/api/v1/playlist/names`, { method: 'GET', mode: 'cors' }),
      HEALTH_TIMEOUT_MS,
    )
    if (!res.ok) return [...FALLBACK_PLAYLIST_NAMES]
    const names = (await res.json()) as unknown
    if (!Array.isArray(names) || names.length === 0) return [...FALLBACK_PLAYLIST_NAMES]
    return names.filter((n): n is string => typeof n === 'string' && n.trim().length > 0)
  } catch {
    return [...FALLBACK_PLAYLIST_NAMES]
  }
}

export async function loadPlaylistFromSourceProvider(
  sheetName: string,
): Promise<Song[] | null> {
  try {
    const res = await withTimeout(
      fetch(`${SOURCE_PROVIDER}/api/v1/playlist/${encodeURIComponent(sheetName)}`, {
        method: 'GET',
        mode: 'cors',
      }),
      HEALTH_TIMEOUT_MS,
    )
    if (!res.ok) return null
    const songs = (await res.json()) as ApiSong[]
    if (!Array.isArray(songs)) return null
    const payload = apiSongsToPlaylistPayload(songs)
    return zipSongs(payload.authors, payload.titles, payload.IDs)
  } catch {
    return null
  }
}

/**
 * Bezpośredni URL do <audio src> (proxy przez API).
 * Bez proxy=true dostaniesz JSON z CDN URL — zwykle nie zagra w przeglądarce.
 */
export function streamUrl(provider: string, youtubeId: string): string {
  const url = youtubeUrl(youtubeId)
  return `${provider}/api/v1/stream/youtube/audio/info?url=${encodeURIComponent(url)}&proxy=true`
}

/** Opcjonalnie: CDN URL z JSON (bez proxy). */
export async function resolveStreamUrl(
  provider: string,
  youtubeId: string,
  timeoutMs = HEALTH_TIMEOUT_MS,
): Promise<string | null> {
  try {
    const watch = youtubeUrl(youtubeId)
    const endpoint = `${provider}/api/v1/stream/youtube/audio/info?url=${encodeURIComponent(watch)}`
    const res = await withTimeout(
      fetch(endpoint, { method: 'GET', mode: 'cors' }),
      timeoutMs,
    )
    if (!res.ok) return null
    const data = (await res.json()) as StreamUrlResponse
    return data.result ?? null
  } catch {
    return null
  }
}

export function youtubeUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}

export function resolveInitialPlaylistName(available: string[]): string {
  const params = new URLSearchParams(window.location.search)
  const fromQuery = params.get('playlist')
  if (fromQuery && available.includes(fromQuery)) return fromQuery
  if (params.get('featured') === '1') {
    const featured = available.find((n) => n.toLowerCase() === 'featured')
    if (featured) return featured
  }
  const preferred = available.find((n) => n === 'Default') ?? available[0]
  return preferred ?? 'Default'
}
