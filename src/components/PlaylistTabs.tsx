import { useEffect, useState } from 'react'
import { useAudio } from '../app/AudioProvider'
import { TrackList } from './TrackList'
import styles from './PlaylistTabs.module.css'

type Tab = 'playlist' | 'queue'

type Props = {
  className?: string
}

export function PlaylistTabs({ className }: Props) {
  const [tab, setTab] = useState<Tab>('playlist')
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

  if (!shuffle) {
    return (
      <TrackList
        className={className}
        title="Playlista"
        songs={songs}
        index={index}
        isPlaying={isPlaying}
        onSelect={setIndex}
      />
    )
  }

  return (
    <section className={`${styles.wrap} ${className ?? ''}`}>
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

      <div
        role="tabpanel"
        id={tab === 'playlist' ? 'panel-playlist' : 'panel-queue'}
        aria-labelledby={tab === 'playlist' ? 'tab-playlist' : 'tab-queue'}
      >
        {tab === 'playlist' ? (
          <TrackList
            title={null}
            songs={songs}
            index={index}
            isPlaying={isPlaying}
            onSelect={setIndex}
          />
        ) : (
          <TrackList
            title={null}
            songs={queue}
            playlistIndices={queueIndices}
            index={index}
            isPlaying={isPlaying}
            onSelect={setIndex}
            queueMode
            emptyLabel="Kolejka pusta — następny utwór przetasuje bag"
            countLabel={`${queue.length} w shuffle`}
          />
        )}
      </div>
    </section>
  )
}
