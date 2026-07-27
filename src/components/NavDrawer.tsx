import { NavLink, useLocation } from 'react-router-dom'
import { useAudio } from '../app/AudioProvider'
import { motionModeLabel, useMotionPreference, type MotionMode } from '../app/MotionPreference'
import styles from './NavDrawer.module.css'

type Props = {
  open: boolean
  onClose: () => void
}

const links = [
  { to: '/', label: 'Start', end: true, match: 'home' as const },
  { to: '/about', label: 'O mnie', match: 'path' as const },
  { to: '/#projects', label: 'Projekty', match: 'projects' as const },
  { to: '/timeline', label: 'Timeline', match: 'path' as const },
  { to: '/labs', label: 'Labs', match: 'path' as const },
  { to: '/minecraft', label: 'Minecraft', match: 'path' as const },
  { to: '/sources', label: 'Źródła', match: 'path' as const },
]

const motionModes: MotionMode[] = ['system', 'reduce', 'full']

export function NavDrawer({ open, onClose }: Props) {
  const { status } = useAudio()
  const { pathname, hash } = useLocation()
  const { mode, setMode, reducedMotion, systemPrefersReduce } = useMotionPreference()

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
          <span className={styles.brand}>Menu</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Zamknij menu">
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
                Muzyka
              </NavLink>
              <NavLink
                to="/now-playing"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={onClose}
              >
                Now Playing
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
          <p className={`mono ${styles.prefsTitle}`}>prefers-reduced-motion</p>
          <p className={styles.prefsHint}>
            System: {systemPrefersReduce ? 'reduce' : 'no-preference'}
            {reducedMotion ? ' · klatka zamrożona' : ' · animacja Three.js'}
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
                {motionModeLabel(m)}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
