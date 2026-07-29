import { Link } from 'react-router-dom'
import { useState } from 'react'
import { NavDrawer } from './NavDrawer'
import { useAudio } from '../app/AudioProvider'
import { AudioSpinner } from './AudioSpinner'
import { IconMusicOff } from './icons/MediaIcons'
import { useLocale } from '../i18n/LocaleContext'
import styles from './SiteHeader.module.css'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { status } = useAudio()
  const { t } = useLocale()

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Lukasz26671
        </Link>
        <div className={styles.actions}>
          {status === 'checking' && (
            <span className={styles.badgeSpin}>
              <AudioSpinner size="sm" label="audio" />
            </span>
          )}
          {status === 'unavailable' && (
            <span
              className={`${styles.badge} ${styles.offline}`}
              title={t('header.audioOffline')}
              role="status"
            >
              <IconMusicOff className={styles.offlineIcon} />
              <span className={styles.offlineText}>{t('header.audioOffline')}</span>
            </span>
          )}
          {status === 'ready' && (
            <Link to="/music" className={styles.badgeLive}>
              {t('header.music')}
            </Link>
          )}
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            {t('header.menu')}
          </button>
        </div>
      </header>
      <NavDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
