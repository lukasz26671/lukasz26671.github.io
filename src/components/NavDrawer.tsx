import { NavLink, useLocation } from 'react-router-dom'
import { useAudio } from '../app/AudioProvider'
import { motionModeLabel, useMotionPreference, type MotionMode } from '../app/MotionPreference'
import { useLocale } from '../i18n/LocaleContext'
import type { Locale } from '../i18n/types'
import styles from './NavDrawer.module.css'

type Props = {
  open: boolean
  onClose: () => void
}

const motionModes: MotionMode[] = ['system', 'reduce', 'full']
const locales: Locale[] = ['pl', 'en']

export function NavDrawer({ open, onClose }: Props) {
  const { status } = useAudio()
  const { pathname, hash } = useLocation()
  const { mode, setMode, reducedMotion, systemPrefersReduce } = useMotionPreference()
  const { locale, setLocale, t } = useLocale()

  const links = [
    { to: '/', label: t('nav.start'), end: true, match: 'home' as const },
    { to: '/about', label: t('nav.about'), match: 'path' as const },
    { to: '/#projects', label: t('nav.projects'), match: 'projects' as const },
    { to: '/timeline', label: t('nav.timeline'), match: 'path' as const },
    { to: '/labs', label: t('nav.labs'), match: 'path' as const },
    { to: '/minecraft', label: t('nav.minecraft'), match: 'path' as const },
    { to: '/sources', label: t('nav.sources'), match: 'path' as const },
  ]

  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`${styles.drawer} ${open ? styles.open : ''}`}
        aria-hidden={!open}
        id="site-menu"
      >
        <div className={styles.head}>
          <span className={styles.brand}>{t('nav.menu')}</span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={t('nav.close')}
          >
            ✕
          </button>
        </div>
        <nav className={styles.nav}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={() => {
                let active = false
                if (l.match === 'home') active = pathname === '/' && hash !== '#projects'
                else if (l.match === 'projects')
                  active = pathname === '/' && hash === '#projects'
                else active = pathname === l.to
                return `${styles.link} ${active ? styles.active : ''}`
              }}
              onClick={onClose}
            >
              {l.label}
            </NavLink>
          ))}
          {status === 'ready' && (
            <>
              <NavLink
                to="/music"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={onClose}
              >
                {t('nav.music')}
              </NavLink>
              <NavLink
                to="/now-playing"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={onClose}
              >
                {t('nav.nowPlaying')}
              </NavLink>
            </>
          )}
          <a className={styles.link} href="/HackerTyper2/" onClick={onClose}>
            HackerTyper 2 ↗
          </a>
          <a className={styles.link} href="/Kalkulator/" onClick={onClose}>
            Kalkulator ↗
          </a>
        </nav>

        <div className={styles.prefs}>
          <p className={`mono ${styles.prefsTitle}`}>{t('nav.language')}</p>
          <div className={styles.prefsRowLang} role="group" aria-label={t('nav.language')}>
            {locales.map((code) => (
              <button
                key={code}
                type="button"
                className={`${styles.prefBtn} ${locale === code ? styles.prefBtnOn : ''}`}
                aria-pressed={locale === code}
                onClick={() => setLocale(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <p className={`mono ${styles.prefsTitle}`}>prefers-reduced-motion</p>
          <p className={styles.prefsHint}>
            System: {systemPrefersReduce ? 'reduce' : 'no-preference'}
            {reducedMotion ? t('nav.motionFrozen') : t('nav.motionLive')}
          </p>
          <div className={styles.prefsRow} role="group" aria-label="Motion preference">
            {motionModes.map((m) => (
              <button
                key={m}
                type="button"
                className={`${styles.prefBtn} ${mode === m ? styles.prefBtnOn : ''}`}
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
              >
                {motionModeLabel(m, locale)}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
