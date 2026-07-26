import { Link } from 'react-router-dom'
import { useAudio } from '../app/AudioProvider'
import styles from './Home.module.css'

export function HomePage() {
  const { status } = useAudio()

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={`mono ${styles.eyebrow}`}>
          Full-stack · .NET · Blazor · React
        </p>

        <h1 className={styles.brand}>Lukasz26671</h1>

        <p className={styles.lead} style={{ textWrap: 'pretty' }}>
          Tworzę aplikacje, które łączą świat kodu z realnymi procesami. Od własnych projektów
          webowych po systemy biznesowe i rozwiązania przemysłowe - i dobrze się przy tym bawię :)
        </p>

        <div className="cta-row">
          <Link to="/projects" className="btn btn-primary">
            Zobacz projekty
          </Link>

          <Link to="/about" className="btn btn-ghost">
            O mnie
          </Link>

          {status === 'ready' && (
            <Link to="/music" className="btn btn-ghost">
              Włącz muzykę
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
