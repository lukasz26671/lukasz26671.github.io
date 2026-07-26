import { Link } from 'react-router-dom'
import { useAudio } from '../app/AudioProvider'
import styles from './PlayerDock.module.css'

export function PlayerDock() {
  const {
    status,
    current,
    isPlaying,
    shuffle,
    loop,
    volume,
    featured,
    toggle,
    next,
    prev,
    setShuffle,
    setLoop,
    setVolume,
    setFeatured,
    openYoutube,
    shareCurrent,
  } = useAudio()

  if (status !== 'ready' || !current) return null

  return (
    <div className={styles.dock} role="region" aria-label="Odtwarzacz audio">
      <div className={styles.meta}>
        <Link to="/now-playing" className={styles.track}>
          <span className={styles.author}>{current.author}</span>
          <span className={styles.title}>{current.title}</span>
        </Link>
        <select
          className={styles.select}
          value={featured ? 'featured' : 'default'}
          onChange={(e) => setFeatured(e.target.value === 'featured')}
          aria-label="Playlista"
        >
          <option value="default">Default</option>
          <option value="featured">Featured</option>
        </select>
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
        <button type="button" className={styles.play} onClick={toggle} title={isPlaying ? 'Pauza' : 'Play'}>
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
