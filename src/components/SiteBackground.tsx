import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './SiteBackground.module.css'

const HeroCanvas = lazy(() =>
  import('./HeroCanvas').then((m) => ({ default: m.HeroCanvas })),
)

export function SiteBackground() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div
      className={`${styles.root} ${isHome ? styles.home : styles.inner}`}
      aria-hidden="true"
    >
      <div className={styles.canvasWrap}>
        <Suspense fallback={<div className={styles.fallback} />}>
          <HeroCanvas />
        </Suspense>
      </div>
      <div className={styles.veil} />
    </div>
  )
}
