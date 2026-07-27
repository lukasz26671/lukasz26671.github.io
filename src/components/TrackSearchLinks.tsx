import {
  trackSearchQueryFromSong,
  trackSearchUrl,
  type TrackSearchTarget,
} from '../lib/audio/searchLinks'
import type { Song } from '../lib/audio/providers'
import {
  AppleMusicNoteIcon,
  GeniusIcon,
  MusixmatchIcon,
  SpotifyIcon,
  YoutubeIcon,
} from './icons/BrandIcons'
import styles from './TrackSearchLinks.module.css'

export type TrackSearchGroup = 'all' | 'stream' | 'lyrics'

type Props = {
  song: Pick<Song, 'title' | 'author'>
  className?: string
  compact?: boolean
  group?: TrackSearchGroup
}

const LINKS: {
  id: TrackSearchTarget
  label: string
  group: 'stream' | 'lyrics'
  Icon: typeof SpotifyIcon
}[] = [
  { id: 'spotify', label: 'Spotify', group: 'stream', Icon: SpotifyIcon },
  { id: 'apple', label: 'Apple Music', group: 'stream', Icon: AppleMusicNoteIcon },
  { id: 'youtube', label: 'YouTube', group: 'stream', Icon: YoutubeIcon },
  { id: 'genius', label: 'Genius', group: 'lyrics', Icon: GeniusIcon },
  { id: 'musixmatch', label: 'Musixmatch', group: 'lyrics', Icon: MusixmatchIcon },
]

export function TrackSearchLinks({
  song,
  className,
  compact,
  group = 'all',
}: Props) {
  const query = trackSearchQueryFromSong(song)
  if (!query) return null

  const links = LINKS.filter((l) => group === 'all' || l.group === group)
  if (links.length === 0) return null

  return (
    <div
      className={`${styles.row} ${compact ? styles.compact : ''} ${className ?? ''}`}
      role="group"
      aria-label={group === 'lyrics' ? 'Teksty utworu' : 'Szukaj utworu'}
    >
      {links.map(({ id, label, Icon }) => (
        <a
          key={id}
          className={styles.link}
          href={trackSearchUrl(id, query)}
          target="_blank"
          rel="noopener noreferrer"
          title={`${label}: ${query}`}
          aria-label={`Szukaj w ${label}: ${query}`}
        >
          <Icon className={styles.icon} />
        </a>
      ))}
    </div>
  )
}
