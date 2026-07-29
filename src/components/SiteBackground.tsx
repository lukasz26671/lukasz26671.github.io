import { lazy, Suspense, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import { useDive } from '../app/DiveContext'
import { useMotionPreference } from '../app/MotionPreference'
import { useLocale } from '../i18n/LocaleContext'
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
  const { t } = useLocale()

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
          title={t('background.enableMotion')}
        >
          <span className={styles.annotationMono}>prefers-reduced-motion</span>
          <span>
            {mode === 'system' ? t('background.systemFrozen') : t('background.menuFrozen')}
          </span>
          <span className={styles.annotationAction}>{t('background.clickEnable')}</span>
        </button>
      )}
    </>
  )
}
