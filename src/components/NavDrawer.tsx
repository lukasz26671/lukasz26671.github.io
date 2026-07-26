import { NavLink } from 'react-router-dom'
import { useAudio } from '../app/AudioProvider'
import styles from './NavDrawer.module.css'

type Props = {
  open: boolean
  onClose: () => void
}

const links = [
  { to: '/', label: 'Start', end: true },
  { to: '/about', label: 'O mnie' },
  { to: '/projects', label: 'Projekty' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/labs', label: 'Labs' },
  { to: '/minecraft', label: 'Minecraft' },
  { to: '/sources', label: 'Źródła' },
]

export function NavDrawer({ open, onClose }: Props) {
  const { status } = useAudio()

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
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
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
      </aside>
    </>
  )
}
