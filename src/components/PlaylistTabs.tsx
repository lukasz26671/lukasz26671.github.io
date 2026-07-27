import { useEffect, useState } from 'react'
import { useAudio } from '../app/AudioProvider'
import { PREF_LIST_TAB, readPref, writePref } from '../lib/prefs'
import { TrackList } from './TrackList'
import styles from './PlaylistTabs.module.css'

type Tab = 'playlist' | 'queue'

function readListTab(): Tab {
  return readPref(PREF_LIST_TAB, 'playlist') === 'queue' ? 'queue' : 'playlist'
}

type Props = {
  className?: string
}

export function PlaylistTabs({ className }: Props) {
  const [tab, setTab] = useState<Tab>(readListTab)
  const [filter, setFilter] = useState('')
  const {
    songs,
    index,
    isPlaying,
    setIndex,
    queue,
    queueIndices,
    shuffle,
  } = useAudio()

  useEffect(() => {
    if (!shuffle && tab === 'queue') setTab('playlist')
  }, [shuffle, tab])

  useEffect(() => {
    writePref(PREF_LIST_TAB, tab)
  }, [tab])

  const list =
    shuffle && tab === 'queue' ? (
      <TrackList
        title={null}
        songs={queue}
        playlistIndices={queueIndices}
        index={index}
        isPlaying={isPlaying}
        onSelect={setIndex}
        queueMode
        filter={filter}
        emptyLabel="Kolejka pusta — następny utwór przetasuje bag"
        countLabel={`${queue.length} w shuffle`}
      />
    ) : (
      <TrackList
        title={shuffle ? null : 'Playlista'}
        songs={songs}
        index={index}
        isPlaying={isPlaying}
        onSelect={setIndex}
        filter={filter}
      />
    )

  return (
    <section className={`${styles.wrap} ${className ?? ''}`}>
      <div className={styles.stickyChrome}>
        {shuffle && (
          <div className={styles.tabs} role="tablist" aria-label="Playlista lub kolejka">
            <button
              type="button"
              role="tab"
              id="tab-playlist"
              aria-selected={tab === 'playlist'}
              aria-controls="panel-playlist"
              className={`${styles.tab} ${tab === 'playlist' ? styles.tabOn : ''}`}
              onClick={() => setTab('playlist')}
            >
              Playlista
              <span className={`mono ${styles.tabCount}`}>{songs.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              id="tab-queue"
              aria-selected={tab === 'queue'}
              aria-controls="panel-queue"
              className={`${styles.tab} ${tab === 'queue' ? styles.tabOn : ''}`}
              onClick={() => setTab('queue')}
            >
              Kolejka
              <span className={`mono ${styles.tabCount}`}>{queue.length}</span>
            </button>
          </div>
        )}

        <label className={styles.search}>
          <span className="sr-only">Szukaj utworu</span>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Szukaj utworu…"
            autoComplete="off"
            enterKeyHint="search"
          />
          {filter.trim() && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setFilter('')}
              aria-label="Wyczyść wyszukiwanie"
            >
              ×
            </button>
          )}
        </label>
      </div>

      <div
        role="tabpanel"
        id={tab === 'playlist' ? 'panel-playlist' : 'panel-queue'}
        aria-labelledby={tab === 'playlist' ? 'tab-playlist' : 'tab-queue'}
      >
        {list}
      </div>
    </section>
  )
}
