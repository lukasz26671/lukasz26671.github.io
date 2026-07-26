export const STREAMING_PROVIDERS = [
  'https://website-audioprovider.herokuapp.com',
  'http://lukasz266713.ddns.net:1234',
] as const

export const SOURCE_PROVIDER = 'http://lukasz266713.ddns.net:3300'

export const HEALTH_TIMEOUT_MS = 4500

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
    const res = await withTimeout(fetch(url, { method: 'GET', mode: 'cors' }), timeoutMs)
    // Must be CORS-readable — otherwise we cannot stream audio in the browser.
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

export async function loadPlaylistFromJson(): Promise<Song[]> {
  const res = await fetch('/songs.json')
  if (!res.ok) throw new Error('songs.json unavailable')
  const data = (await res.json()) as SongsJson
  const s = data.streamingSongs
  if (!s) return []
  return zipSongs(s.authors, s.names, s.ID)
}

export async function loadPlaylistFromSourceProvider(
  featured: boolean,
): Promise<Song[] | null> {
  try {
    const res = await withTimeout(
      fetch(`${SOURCE_PROVIDER}/api/readplaylist/${featured ? 'featured' : ''}`, {
        method: 'POST',
      }),
      HEALTH_TIMEOUT_MS,
    )
    if (!res.ok) return null
    const data = (await res.json()) as PlaylistPayload
    return zipSongs(data.authors, data.titles, data.IDs)
  } catch {
    return null
  }
}

export function streamUrl(provider: string, youtubeId: string): string {
  return `${provider}/stream_id/${youtubeId}?format=mp3`
}

export function youtubeUrl(youtubeId: string): string {
  return `https://youtube.com/watch?v=${youtubeId}`
}
