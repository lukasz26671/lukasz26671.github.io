import { lazy, Suspense, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import { useDive } from '../app/DiveContext'
import styles from './SiteBackground.module.css'

const HeroCanvas = lazy(() =>
  import('./HeroCanvas').then((m) => ({ default: m.HeroCanvas })),
)

export function SiteBackground() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const { progress } = useDive()
  const dive = isHome ? progress : 0

  return (
    <div
      className={`${styles.root} ${isHome ? styles.home : styles.inner}`}
      style={{ '--dive': String(dive) } as CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.canvasWrap}>
        <Suspense fallback={<div className={styles.fallback} />}>
          <HeroCanvas diveProgress={dive} />
        </Suspense>
      </div>
      <div className={styles.veil} />
    </div>
  )
}
