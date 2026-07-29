import { useMemo } from 'react'
import type { Song } from '../lib/audio/providers'
import { useLocale } from '../i18n/LocaleContext'
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
  /** Filtr tytułu / autora (z sticky search) */
  filter?: string
}

export function TrackList({
  songs,
  index,
  isPlaying,
  onSelect,
  playlistIndices,
  title,
  countLabel,
  emptyLabel,
  className,
  queueMode = false,
  filter = '',
}: Props) {
  const { t } = useLocale()
  const resolvedTitle = title === undefined ? t('playlist.playlist') : title
  const resolvedEmpty = emptyLabel ?? t('playlist.noTracks')
  const resolvedCount =
    countLabel ?? t('playlist.trackCount', { count: songs.length })

  const rows = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    return songs
      .map((song, i) => ({
        song,
        row: i,
        playlistIndex: playlistIndices?.[i] ?? i,
      }))
      .filter(({ song }) => {
        if (!needle) return true
        return (
          song.title.toLowerCase().includes(needle) ||
          song.author.toLowerCase().includes(needle)
        )
      })
  }, [songs, playlistIndices, filter])

  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      {resolvedTitle != null && (
        <div className={styles.head}>
          <h2>{resolvedTitle}</h2>
          <span className={`mono ${styles.count}`}>{resolvedCount}</span>
        </div>
      )}

      {songs.length === 0 ? (
        <p className={`mono ${styles.empty}`}>{resolvedEmpty}</p>
      ) : rows.length === 0 ? (
        <p className={`mono ${styles.empty}`}>
          {t('playlist.noResults', { query: filter.trim() })}
        </p>
      ) : (
        <ul className={styles.list}>
          {rows.map(({ song, row, playlistIndex }) => {
            const active = !queueMode && playlistIndex === index
            return (
              <li key={`${song.id}-${playlistIndex}-${row}`}>
                <button
                  type="button"
                  className={`${styles.row} ${active ? styles.active : ''}`}
                  onClick={() => onSelect(playlistIndex)}
                >
                  <span className={`mono ${styles.num}`}>
                    {active && isPlaying ? (
                      <span className={styles.pulse} aria-hidden="true" />
                    ) : (
                      String(row + 1).padStart(2, '0')
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
                  {queueMode && row === 0 && !filter.trim() && (
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
