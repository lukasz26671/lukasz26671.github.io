import type { Song } from '../lib/audio/providers'
import styles from './TrackList.module.css'

type Props = {
  songs: Song[]
  index: number
  isPlaying: boolean
  onSelect: (i: number) => void
  title?: string
  className?: string
}

export function TrackList({
  songs,
  index,
  isPlaying,
  onSelect,
  title = 'Playlista',
  className,
}: Props) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <div className={styles.head}>
        <h2>{title}</h2>
        <span className={`mono ${styles.count}`}>{songs.length} utworów</span>
      </div>
      <ul className={styles.list}>
        {songs.map((song, i) => {
          const active = i === index
          return (
            <li key={song.id}>
              <button
                type="button"
                className={`${styles.row} ${active ? styles.active : ''}`}
                onClick={() => onSelect(i)}
              >
                <span className={`mono ${styles.num}`}>
                  {active && isPlaying ? (
                    <span className={styles.pulse} aria-hidden="true" />
                  ) : (
                    String(i + 1).padStart(2, '0')
                  )}
                </span>
                <span className={styles.meta}>
                  <strong>{song.title}</strong>
                  <em>{song.author}</em>
                </span>
                {active && (
                  <span className={`mono ${styles.badge}`}>
                    {isPlaying ? 'playing' : 'selected'}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
