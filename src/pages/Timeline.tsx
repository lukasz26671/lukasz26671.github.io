import { timeline } from '../data/timeline'
import { useLocale } from '../i18n/LocaleContext'
import { localize } from '../i18n/types'
import styles from './Timeline.module.css'

export function TimelinePage() {
  const { locale, t } = useLocale()

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('timeline.title')}</h1>
        <p>{t('timeline.lead')}</p>
      </header>

      <div className={`glass ${styles.wrap}`}>
        <ol className={styles.list}>
          {timeline.map((item) => (
            <li key={item.year.pl} className={styles.item}>
              <span className={`mono ${styles.year}`}>{localize(locale, item.year)}</span>
              <div className={styles.content}>
                <h2>{localize(locale, item.title)}</h2>
                <p>{localize(locale, item.body)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
