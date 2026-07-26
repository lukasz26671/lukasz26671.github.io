import { timeline } from '../data/timeline'
import styles from './Timeline.module.css'

export function TimelinePage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Timeline</h1>
        <p>Od pierwszych linijek kodu w Javie, do pracy jako fullstack developer oraz studiów.</p>
      </header>

      <div className={`glass ${styles.wrap}`}>
        <ol className={styles.list}>
          {timeline.map((item) => (
            <li key={item.year} className={styles.item}>
              <span className={`mono ${styles.year}`}>{item.year}</span>
              <div className={styles.content}>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
