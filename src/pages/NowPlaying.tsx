import { Link } from 'react-router-dom'
import { useAudio } from '../app/AudioProvider'
import styles from './NowPlaying.module.css'

export function NowPlayingPage() {
  const { current, isPlaying, toggle, next, prev, openYoutube, shareCurrent, index } = useAudio()

  if (!current) {
    return (
      <div className="page">
        <p style={{ color: 'var(--sn-text-secondary)' }}>Brak utworu.</p>
      </div>
    )
  }

  return (
    <div className={`page ${styles.wrap}`}>
      <div className={`glass ${styles.card}`}>
        <p className={`mono ${styles.kicker}`}>Now Playing · #{index + 1}</p>
        <h1>{current.title}</h1>
        <p className={styles.author}>{current.author}</p>
        <div className={styles.controls}>
          <button type="button" className="btn btn-ghost" onClick={prev}>
            Prev
          </button>
          <button type="button" className="btn btn-primary" onClick={toggle}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={next}>
            Next
          </button>
        </div>
        <div className={styles.links}>
          <button type="button" onClick={openYoutube}>
            YouTube
          </button>
          <button type="button" onClick={() => void shareCurrent()}>
            Share link
          </button>
          <Link to="/music">Pełna lista</Link>
        </div>
      </div>
    </div>
  )
}
