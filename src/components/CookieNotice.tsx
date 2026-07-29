import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/LocaleContext'
import styles from './CookieNotice.module.css'

const KEY = 'sn-cookie-ok'

export function CookieNotice() {
  const { t } = useLocale()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className={styles.bar} role="dialog" aria-label={t('cookie.aria')}>
      <p>{t('cookie.body')}</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          localStorage.setItem(KEY, '1')
          setVisible(false)
        }}
      >
        {t('cookie.ok')}
      </button>
    </div>
  )
}
