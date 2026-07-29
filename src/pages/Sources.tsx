import { learningSources } from '../data/sources'
import { useLocale } from '../i18n/LocaleContext'
import { localize } from '../i18n/types'
import styles from './Sources.module.css'

export function SourcesPage() {
  const { locale, t } = useLocale()

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('sources.title')}</h1>
        <p>{t('sources.lead')}</p>
      </header>
      <ul className={styles.list}>
        {learningSources.map((s) => (
          <li key={s.url} className={`glass ${styles.item}`}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.name}
            </a>
            <span>{localize(locale, s.note)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
