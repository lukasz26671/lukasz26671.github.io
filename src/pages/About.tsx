import {
  getCommercialLinkedPair,
  getCommercialStandalone,
} from '../data/projects'
import { useLocale } from '../i18n/LocaleContext'
import { localize, localizeList, pluralizeYears } from '../i18n/types'
import styles from './About.module.css'

export function AboutPage() {
  const { locale, t } = useLocale()
  const age = getAge(new Date(2004, 2, 9))
  const [signOnGlass, sentinel] = getCommercialLinkedPair()
  const commercialSolo = getCommercialStandalone()
  const years = pluralizeYears(locale, age)

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('about.title')}</h1>
        <p>{t('about.intro', { age, years })}</p>
      </header>

      <div className={`glass ${styles.stack}`}>
        <section>
          <h2 className={styles.sectionTitle}>{t('about.currentlyTitle')}</h2>
          <p className={styles.body}>
            {t('about.currentlyP1Before')}{' '}
            <span className={styles.keep}>
              <strong>C#</strong>, <strong>.NET</strong> {t('about.and')} <strong>Blazor</strong>
            </span>
            . {t('about.currentlyP1After')}
          </p>
          <p className={styles.bodySpaced}>{t('about.currentlyP2')}</p>
          <p className={styles.bodySpaced}>{t('about.currentlyP3')}</p>
        </section>

        <section id="commercial" className={styles.projectsSection}>
          <h2 className={styles.sectionTitle}>{t('about.commercialTitle')}</h2>

          <p className={styles.projectsIntro}>{t('about.commercialIntro')}</p>

          <div className={styles.linkedCluster}>
            <ul className={styles.projectList}>
              {[signOnGlass, sentinel].map((p) => (
                <li key={p.id} className={styles.projectItem}>
                  <div className={styles.projectHead}>
                    <span className={styles.projectName}>{p.name}</span>
                    {p.tags && (
                      <span className={styles.projectTag}>
                        {localizeList(locale, p.tags).join(' · ')}
                      </span>
                    )}
                  </div>
                  <p>
                    {localize(locale, p.longDescription ?? p.description)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <ul className={styles.projectList}>
            {commercialSolo.map((p) => (
              <li key={p.id} className={styles.projectItem}>
                <div className={styles.projectHead}>
                  <span className={styles.projectName}>{p.name}</span>
                  {p.tags && (
                    <span className={styles.projectTag}>
                      {localizeList(locale, p.tags).join(' · ')}
                    </span>
                  )}
                </div>
                <p>{localize(locale, p.longDescription ?? p.description)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>{t('about.beginningsTitle')}</h2>
          <p className={styles.body}>{t('about.beginningsP1')}</p>
          <p className={styles.bodySpaced}>{t('about.beginningsP2')}</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>{t('about.afterHoursTitle')}</h2>
          <p className={styles.body}>{t('about.afterHoursBody')}</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>{t('about.siteTitle')}</h2>
          <p className={styles.body}>{t('about.siteP1')}</p>
          <p className={styles.bodySpaced}>{t('about.siteP2')}</p>
        </section>
      </div>
    </div>
  )
}

function getAge(birth: Date, now = new Date()): number {
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()

  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age -= 1
  }

  return age
}
