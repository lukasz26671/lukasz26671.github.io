import { Link } from 'react-router-dom'
import { useAudio } from '../app/AudioProvider'
import { AudioSpinner } from './AudioSpinner'
import { PlaylistSelect } from './PlaylistSelect'
import styles from './PlayerDock.module.css'

export function PlayerDock() {
  const {
    status,
    current,
    isPlaying,
    shuffle,
    loop,
    volume,
    playlistName,
    playlistNames,
    playbackIssue,
    toggle,
    next,
    prev,
    setShuffle,
    setLoop,
    setVolume,
    setPlaylistName,
    openYoutube,
    shareCurrent,
  } = useAudio()

  if (status !== 'ready' || !current) return null

  return (
    <div className={styles.dock} role="region" aria-label="Odtwarzacz audio">
      <div className={styles.left}>
        <div className={`${styles.eq} ${isPlaying ? styles.eqLive : ''}`} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <Link to="/now-playing" className={styles.track}>
          <span className={styles.author}>{current.author}</span>
          <span className={styles.title}>{current.title}</span>
          {playbackIssue === 'retrying' && (
            <AudioSpinner className={styles.notice} label="Ładowanie" size="sm" />
          )}
          {playbackIssue === 'unavailable' && (
            <span className={`mono ${styles.noticeWarn}`}>
              Niedostępny
              <button
                type="button"
                className={styles.retryInline}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openYoutube()
                }}
              >
                YouTube
              </button>
            </span>
          )}
        </Link>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={shuffle ? styles.on : undefined}
          onClick={() => setShuffle(!shuffle)}
          aria-pressed={shuffle}
          title="Shuffle"
        >
          ⇄
        </button>
        <button type="button" onClick={prev} title="Poprzedni">
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
        <button type="button" onClick={next} title="Następny">
          ⏭
        </button>
        <button
          type="button"
          className={loop ? styles.on : undefined}
          onClick={() => setLoop(!loop)}
          aria-pressed={loop}
          title="Loop"
        >
          ↻
        </button>
      </div>

      <div className={styles.right}>
        <PlaylistSelect
          value={playlistName}
          options={playlistNames}
          onChange={setPlaylistName}
        />
        <button type="button" onClick={openYoutube} title="YouTube">
          YT
        </button>
        <button type="button" onClick={() => void shareCurrent()} title="Udostępnij">
          Share
        </button>
        <label className={styles.vol}>
          <span className="sr-only">Głośność</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
          />
        </label>
      </div>
    </div>
  )
}
