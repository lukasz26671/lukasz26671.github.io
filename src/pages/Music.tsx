import { useAudio } from '../app/AudioProvider'
import { AudioSpinner } from '../components/AudioSpinner'
import { TrackList } from '../components/TrackList'
import { useSiteBack } from '../lib/useSiteBack'
import styles from './Music.module.css'

export function MusicPage() {
  const {
    songs,
    index,
    setIndex,
    current,
    isPlaying,
    toggle,
    playbackIssue,
    openYoutube,
    playlistName,
  } = useAudio()
  const goBack = useSiteBack('/')

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={goBack}>
          ← Wróć
        </button>
        <p className={`mono ${styles.eyebrow}`}>Stream · {playlistName}</p>
        <h1>Muzyka</h1>
        <p className={styles.lead}>
          Playlista z serwera audio
        </p>
      </header>

      {current && (
        <section className={styles.now} aria-label="Teraz odtwarzane">
          <div className={styles.nowVisual} aria-hidden="true">
            <div className={`${styles.eq} ${isPlaying ? styles.eqLive : ''}`}>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={styles.nowBody}>
            <p className={`mono ${styles.nowLabel}`}>Now playing</p>
            <h2 className={styles.nowTitle}>{current.title}</h2>
            <p className={styles.nowAuthor}>{current.author}</p>

            {playbackIssue === 'retrying' && (
              <AudioSpinner className={styles.issue} label="Ładowanie…" size="md" />
            )}
            {playbackIssue === 'unavailable' && (
              <p className={`mono ${styles.issueWarn}`}>
                „{current.title}” niedostępny na streamie.{' '}
                <button type="button" className={styles.retry} onClick={openYoutube}>
                  Posłuchaj na YouTube
                </button>
              </p>
            )}
          </div>

          <button
            type="button"
            className={`${styles.nowPlay} ${isPlaying ? styles.nowPlayOn : ''}`}
            onClick={toggle}
            aria-label={isPlaying ? 'Pauza' : 'Odtwórz'}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
        </section>
      )}

      <TrackList
        songs={songs}
        index={index}
        isPlaying={isPlaying}
        onSelect={setIndex}
      />
    </div>
  )
}
