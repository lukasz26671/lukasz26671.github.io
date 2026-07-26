import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDive } from './DiveContext'

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

/** Sync `--scroll-depth` (0→1) z deep dive na Home albo ze scrollem na innych stronach. */
export function ScrollDepthStyle() {
  const { pathname } = useLocation()
  const { progress } = useDive()

  useEffect(() => {
    const root = document.documentElement

    const apply = (value: number) => {
      root.style.setProperty('--scroll-depth', String(clamp01(value)))
    }

    if (pathname === '/') {
      apply(progress)
      return () => {
        root.style.removeProperty('--scroll-depth')
      }
    }

    const onScroll = () => {
      const max = root.scrollHeight - window.innerHeight
      apply(max > 0 ? window.scrollY / max : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      root.style.removeProperty('--scroll-depth')
    }
  }, [pathname, progress])

  return null
}
