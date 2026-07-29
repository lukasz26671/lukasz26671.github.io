import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale } from '../i18n/LocaleContext'
import { initAnalytics, trackPageView } from '../lib/analytics'
import { acceptCookieConsent, hasCookieConsent } from '../lib/consent'
import styles from './CookieNotice.module.css'

export function CookieNotice() {
  const { t } = useLocale()
  const { pathname, search, hash } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!hasCookieConsent()) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className={styles.bar} role="dialog" aria-label={t('cookie.aria')}>
      <p>{t('cookie.body')}</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          acceptCookieConsent()
          initAnalytics()
          trackPageView(`${pathname}${search}${hash}`)
          setVisible(false)
        }}
      >
        {t('cookie.ok')}
      </button>
    </div>
  )
}
