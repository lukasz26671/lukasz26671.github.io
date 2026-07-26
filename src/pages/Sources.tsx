import { learningSources } from '../data/sources'
import styles from './Sources.module.css'

export function SourcesPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Źródła</h1>
        <p>Materiały, z których kiedyś uczyłem się webu — wciąż dobre na start.</p>
      </header>
      <ul className={styles.list}>
        {learningSources.map((s) => (
          <li key={s.url} className={`glass ${styles.item}`}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.name}
            </a>
            <span>{s.note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
