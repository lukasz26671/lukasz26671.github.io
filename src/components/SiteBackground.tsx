import { lazy, Suspense, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import { useDive } from '../app/DiveContext'
import { useMotionPreference } from '../app/MotionPreference'
import styles from './SiteBackground.module.css'

const HeroCanvas = lazy(() =>
  import('./HeroCanvas').then((m) => ({ default: m.HeroCanvas })),
)

export function SiteBackground() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const { progress } = useDive()
  const dive = isHome ? progress : 0
  const { reducedMotion, mode, setMode } = useMotionPreference()

  return (
    <>
      <div
        className={`${styles.root} ${isHome ? styles.home : styles.inner} ${reducedMotion ? styles.reduced : ''}`}
        style={{ '--dive': String(dive) } as CSSProperties}
        aria-hidden="true"
      >
        <div className={styles.canvasWrap}>
          <Suspense fallback={<div className={styles.fallback} />}>
            <HeroCanvas diveProgress={dive} frozen={reducedMotion} />
          </Suspense>
        </div>
        <div className={styles.veil} />
      </div>

      {reducedMotion && isHome && (
        <button
          type="button"
          className={styles.annotation}
          onClick={() => setMode('full')}
          title="Włącz pełny motion"
        >
          <span className={styles.annotationMono}>prefers-reduced-motion</span>
          <span>
            {mode === 'system'
              ? 'Ustawienie systemu · klatka zamrożona'
              : 'Włączone w menu · klatka zamrożona'}
          </span>
          <span className={styles.annotationAction}>Kliknij, by włączyć motion</span>
        </button>
      )}
    </>
  )
}
