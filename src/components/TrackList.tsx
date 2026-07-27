import type { Song } from '../lib/audio/providers'
import styles from './TrackList.module.css'

type Props = {
  songs: Song[]
  /** Aktywny indeks w playliście źródłowej */
  index: number
  isPlaying: boolean
  onSelect: (playlistIndex: number) => void
  /** Mapowanie wiersza → indeks playlisty (dla kolejki) */
  playlistIndices?: number[]
  title?: string | null
  countLabel?: string
  emptyLabel?: string
  className?: string
  /** W kolejce nie ma „playing” na current — tylko pozycje następne */
  queueMode?: boolean
}

export function TrackList({
  songs,
  index,
  isPlaying,
  onSelect,
  playlistIndices,
  title = 'Playlista',
  countLabel,
  emptyLabel = 'Brak utworów',
  className,
  queueMode = false,
}: Props) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      {title != null && (
        <div className={styles.head}>
          <h2>{title}</h2>
          <span className={`mono ${styles.count}`}>
            {countLabel ?? `${songs.length} utworów`}
          </span>
        </div>
      )}

      {songs.length === 0 ? (
        <p className={`mono ${styles.empty}`}>{emptyLabel}</p>
      ) : (
        <ul className={styles.list}>
          {songs.map((song, i) => {
            const playlistIndex = playlistIndices?.[i] ?? i
            const active = !queueMode && playlistIndex === index
            return (
              <li key={`${song.id}-${playlistIndex}-${i}`}>
                <button
                  type="button"
                  className={`${styles.row} ${active ? styles.active : ''}`}
                  onClick={() => onSelect(playlistIndex)}
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
                  {queueMode && i === 0 && (
                    <span className={`mono ${styles.badge}`}>next</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
