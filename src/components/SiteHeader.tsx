import { Link } from 'react-router-dom'
import { useState } from 'react'
import { NavDrawer } from './NavDrawer'
import { useAudio } from '../app/AudioProvider'
import styles from './SiteHeader.module.css'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { status } = useAudio()

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Lukasz26671
        </Link>
        <div className={styles.actions}>
          {status === 'checking' && (
            <span className={styles.badge}>audio…</span>
          )}
          {status === 'unavailable' && (
            <span className={`${styles.badge} ${styles.offline}`}>muzyka offline</span>
          )}
          {status === 'ready' && (
            <Link to="/music" className={styles.badgeLive}>
              muzyka
            </Link>
          )}
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>
      <NavDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
