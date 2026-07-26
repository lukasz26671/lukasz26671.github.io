import { useAudio } from '../app/AudioProvider'
import { AudioSpinner } from '../components/AudioSpinner'
import { TrackList } from '../components/TrackList'
import { useSiteBack } from '../lib/useSiteBack'
import styles from './NowPlaying.module.css'

export function NowPlayingPage() {
  const {
    current,
    isPlaying,
    toggle,
    next,
    prev,
    openYoutube,
    shareCurrent,
    index,
    setIndex,
    playbackIssue,
    retryCurrent,
    playlistName,
    songs,
  } = useAudio()
  const goBack = useSiteBack('/music')

  if (!current) {
    return (
      <div className={`page ${styles.page}`}>
        <button type="button" className={styles.back} onClick={goBack}>
          ← Wróć
        </button>
        <p className={styles.empty}>Brak utworu do odtworzenia.</p>
      </div>
    )
  }

  return (
    <div className={`page ${styles.page}`}>
      <button type="button" className={styles.back} onClick={goBack}>
        ← Wróć
      </button>

      <div className={styles.hero}>
        <div className={styles.stage} aria-hidden="true">
          <div className={`${styles.orb} ${isPlaying ? styles.orbLive : ''}`} />
          <div className={styles.rings}>
            <span />
            <span />
            <span />
          </div>
        </div>

        <article className={styles.card}>
          <p className={`mono ${styles.kicker}`}>
            Now playing · {playlistName} · {index + 1}/{songs.length || '—'}
          </p>

          <div className={`${styles.eq} ${isPlaying ? styles.eqLive : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <h1 className={styles.title}>{current.title}</h1>
          <p className={styles.author}>{current.author}</p>

          {playbackIssue === 'retrying' && (
            <AudioSpinner className={styles.issue} label="Ładowanie streamu…" size="md" />
          )}
          {playbackIssue === 'unavailable' && (
            <p className={`mono ${styles.issueWarn}`}>
              Utwór tymczasowo niedostępny.{' '}
              <button type="button" className={styles.retry} onClick={retryCurrent}>
                Spróbuj ponownie
              </button>
            </p>
          )}

          <div className={styles.controls}>
            <button type="button" className={styles.ctrl} onClick={prev} title="Poprzedni">
              ⏮
            </button>
            <button
              type="button"
              className={`${styles.play} ${isPlaying ? styles.playOn : ''}`}
              onClick={toggle}
              title={isPlaying ? 'Pauza' : 'Play'}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button type="button" className={styles.ctrl} onClick={next} title="Następny">
              ⏭
            </button>
          </div>

          <div className={styles.links}>
            <button type="button" className={styles.linkBtn} onClick={openYoutube}>
              YouTube
            </button>
            <button type="button" className={styles.linkBtn} onClick={() => void shareCurrent()}>
              Share
            </button>
          </div>
        </article>
      </div>

      <TrackList
        className={styles.list}
        songs={songs}
        index={index}
        isPlaying={isPlaying}
        onSelect={setIndex}
        title="Playlista"
      />
    </div>
  )
}
