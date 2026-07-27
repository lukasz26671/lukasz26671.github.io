import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../app/AudioProvider'
import {
  activeSyncedIndex,
  fetchLyrics,
  type LyricsResult,
  type SyncedLyricLine,
} from '../lib/audio/fetchLyrics'
import { trackSearchQueryFromSong, LYRICS_SEARCH_LINKS } from '../lib/audio/searchLinks'
import {
  PREF_LYRICS_SYNCED,
  PREF_STREAM_TAB,
  readPref,
  writePref,
} from '../lib/prefs'
import { PlaylistTabs } from './PlaylistTabs'
import { TrackSearchLinks } from './TrackSearchLinks'
import styles from './StreamLyricsTabs.module.css'

type Tab = 'stream' | 'lyrics'

type Props = {
  className?: string
  hideStreamActions?: boolean
}

function readStreamTab(): Tab {
  return readPref(PREF_STREAM_TAB, 'stream') === 'lyrics' ? 'lyrics' : 'stream'
}

function readSyncedPref(): boolean {
  return readPref(PREF_LYRICS_SYNCED, '0') === '1'
}

function SyncedLyricsView({
  lines,
  getCurrentTime,
}: {
  lines: SyncedLyricLine[]
  getCurrentTime: () => number
}) {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement | null>(null)
  const lineRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const idx = activeSyncedIndex(lines, getCurrentTime())
      setActive((prev) => (prev === idx ? prev : Math.max(0, idx)))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [lines, getCurrentTime])

  useEffect(() => {
    const list = listRef.current
    const line = lineRefs.current[Math.max(0, active)]
    if (!list || !line) return

    const listRect = list.getBoundingClientRect()
    const lineRect = line.getBoundingClientRect()
    const nextTop =
      lineRect.top -
      listRect.top +
      list.scrollTop -
      (list.clientHeight - lineRect.height) / 2

    const max = Math.max(0, list.scrollHeight - list.clientHeight)
    const clamped = Math.max(0, Math.min(nextTop, max))
    if (Math.abs(list.scrollTop - clamped) > 1) {
      list.scrollTop = clamped
    }
  }, [active])

  return (
    <ul ref={listRef} className={styles.syncedList}>
      {lines.map((line, i) => (
        <li
          key={`${line.time}-${i}`}
          ref={(el) => {
            lineRefs.current[i] = el
          }}
          className={`${styles.syncedLine} ${i === active ? styles.syncedActive : ''}`}
        >
          {line.text}
        </li>
      ))}
    </ul>
  )
}

export function StreamLyricsTabs({ className, hideStreamActions }: Props) {
  const [tab, setTab] = useState<Tab>(readStreamTab)
  const { current, openYoutube, shareCurrent, getCurrentTime } = useAudio()
  const query = current ? trackSearchQueryFromSong(current) : ''

  const [lyrics, setLyrics] = useState<LyricsResult | null>(null)
  const [lyricsStatus, setLyricsStatus] = useState<'idle' | 'loading' | 'ready' | 'missing'>(
    'idle',
  )
  const [syncedOn, setSyncedOn] = useState(readSyncedPref)

  useEffect(() => {
    writePref(PREF_STREAM_TAB, tab)
  }, [tab])

  useEffect(() => {
    writePref(PREF_LYRICS_SYNCED, syncedOn ? '1' : '0')
  }, [syncedOn])

  useEffect(() => {
    if (tab !== 'lyrics' || !current) return

    let cancelled = false
    setLyricsStatus('loading')
    setLyrics(null)

    void fetchLyrics(current).then((result) => {
      if (cancelled) return
      if (result) {
        setLyrics(result)
        setLyricsStatus('ready')
      } else {
        setLyrics(null)
        setLyricsStatus('missing')
      }
    })

    return () => {
      cancelled = true
    }
  }, [tab, current])

  const canSync = Boolean(lyrics?.synced && lyrics.synced.length > 0)

  return (
    <section className={`${styles.wrap} ${className ?? ''}`}>
      <div className={styles.tabs} role="tablist" aria-label="Stream lub lyrics">
        <button
          type="button"
          role="tab"
          id="tab-stream"
          aria-selected={tab === 'stream'}
          aria-controls="panel-stream"
          className={`${styles.tab} ${tab === 'stream' ? styles.tabOn : ''}`}
          onClick={() => setTab('stream')}
        >
          Stream
        </button>
        <button
          type="button"
          role="tab"
          id="tab-lyrics"
          aria-selected={tab === 'lyrics'}
          aria-controls="panel-lyrics"
          className={`${styles.tab} ${tab === 'lyrics' ? styles.tabOn : ''}`}
          onClick={() => setTab('lyrics')}
        >
          Lyrics
        </button>
      </div>

      <div
        role="tabpanel"
        id={tab === 'stream' ? 'panel-stream' : 'panel-lyrics'}
        aria-labelledby={tab === 'stream' ? 'tab-stream' : 'tab-lyrics'}
      >
        {tab === 'stream' ? (
          <div className={styles.panel}>
            {current && !hideStreamActions && (
              <div className={styles.tools}>
                <TrackSearchLinks song={current} group="stream" />
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.action}
                    onClick={openYoutube}
                    title="Otwórz film na YouTube"
                  >
                    Watch
                  </button>
                  <button
                    type="button"
                    className={styles.action}
                    onClick={() => void shareCurrent()}
                  >
                    Share
                  </button>
                </div>
              </div>
            )}
            <PlaylistTabs />
          </div>
        ) : (
          <div className={styles.panel}>
            {current && query ? (
              <>
                <p className={`mono ${styles.lyricsLead}`}>Tekst · {query}</p>

                {lyricsStatus === 'loading' && (
                  <p className={`mono ${styles.empty}`}>Szukam tekstu…</p>
                )}
                {lyricsStatus === 'ready' && lyrics && (
                  <article className={styles.lyricsBody}>
                    <div className={styles.lyricsToolbar}>
                      <p className={`mono ${styles.lyricsSource}`}>via {lyrics.source}</p>
                      {canSync && (
                        <label className={styles.syncToggle}>
                          <span>Synced</span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={syncedOn}
                            aria-label="Synced lyrics"
                            className={`${styles.switch} ${syncedOn ? styles.switchOn : ''}`}
                            onClick={() => setSyncedOn((v) => !v)}
                          >
                            <span className={styles.switchThumb} />
                          </button>
                        </label>
                      )}
                    </div>
                    {syncedOn && canSync && lyrics.synced ? (
                      <>
                        <p className={`mono ${styles.syncNote}`} role="note">
                          Może być niedokładne względem streamu (inny master / offset).
                        </p>
                        <SyncedLyricsView
                          lines={lyrics.synced}
                          getCurrentTime={getCurrentTime}
                        />
                      </>
                    ) : (
                      <pre className={styles.lyricsText}>{lyrics.text}</pre>
                    )}
                  </article>
                )}
                {lyricsStatus === 'missing' && (
                  <p className={`mono ${styles.empty}`}>
                    Nie znaleziono tekstu automatycznie — spróbuj poniżej.
                  </p>
                )}

                <ul className={styles.lyricsList}>
                  {LYRICS_SEARCH_LINKS.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href(query)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className={`mono ${styles.empty}`}>Brak utworu.</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
