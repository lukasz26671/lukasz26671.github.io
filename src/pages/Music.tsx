import { useAudio } from '../app/AudioProvider'
import styles from './Music.module.css'

export function MusicPage() {
  const { songs, index, setIndex, current, isPlaying, toggle } = useAudio()

  return (
    <div className="page">
      <header className="page-header">
        <h1>Muzyka</h1>
        <p>Playlista streamowana z serwera audio. Sterowanie też w docku na dole.</p>
      </header>

      {current && (
        <div className={`glass ${styles.now}`}>
          <div>
            <p className={styles.label}>Teraz</p>
            <h2>
              {current.author} — {current.title}
            </h2>
          </div>
          <button type="button" className="btn btn-primary" onClick={toggle}>
            {isPlaying ? 'Pauza' : 'Play'}
          </button>
        </div>
      )}

      <ul className={styles.list}>
        {songs.map((song, i) => (
          <li key={song.id}>
            <button
              type="button"
              className={`${styles.row} ${i === index ? styles.active : ''}`}
              onClick={() => setIndex(i)}
            >
              <span className={`mono ${styles.num}`}>{i + 1}</span>
              <span className={styles.meta}>
                <strong>{song.title}</strong>
                <em>{song.author}</em>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
