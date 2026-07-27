import type { Song } from './providers'

export function isUnknownAuthor(author: string): boolean {
  const a = author.trim().toLowerCase()
  return !a || a === 'unknown' || a === 'unknown artist' || a === 'n/a' || a === '?'
}

/** Query do wyszukiwarek: bez artysty gdy unknown. */
export function trackSearchQuery(title: string, author: string): string {
  const t = title.trim()
  if (!t) return ''
  if (isUnknownAuthor(author)) return t
  return `${author.trim()} ${t}`
}

export function trackSearchQueryFromSong(song: Pick<Song, 'title' | 'author'>): string {
  return trackSearchQuery(song.title, song.author)
}

export function spotifySearchUrl(query: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`
}

export function appleMusicSearchUrl(query: string): string {
  return `https://music.apple.com/us/search?term=${encodeURIComponent(query)}`
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}

export function geniusSearchUrl(query: string): string {
  return `https://genius.com/search?q=${encodeURIComponent(query)}`
}

export function musixmatchSearchUrl(query: string): string {
  return `https://www.musixmatch.com/search?query=${encodeURIComponent(query)}`
}

/** np. https://www.google.com/search?q=ukeboy+stalker+lyrics */
export function googleLyricsSearchUrl(query: string): string {
  const q = /\blyrics\b/i.test(query) ? query : `${query} lyrics`
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`
}

export type LyricsSearchLink = {
  id: string
  label: string
  href: (query: string) => string
}

/** Linki do wyszukiwania tekstów (zakładka Lyrics). */
export const LYRICS_SEARCH_LINKS: LyricsSearchLink[] = [
  { id: 'google', label: 'Google', href: googleLyricsSearchUrl },
  { id: 'genius', label: 'Genius', href: geniusSearchUrl },
  { id: 'musixmatch', label: 'Musixmatch', href: musixmatchSearchUrl },
]

export type TrackSearchTarget =
  | 'spotify'
  | 'apple'
  | 'youtube'
  | 'genius'
  | 'musixmatch'
  | 'google'

export function trackSearchUrl(target: TrackSearchTarget, query: string): string {
  switch (target) {
    case 'spotify':
      return spotifySearchUrl(query)
    case 'apple':
      return appleMusicSearchUrl(query)
    case 'youtube':
      return youtubeSearchUrl(query)
    case 'genius':
      return geniusSearchUrl(query)
    case 'musixmatch':
      return musixmatchSearchUrl(query)
    case 'google':
      return googleLyricsSearchUrl(query)
  }
}
