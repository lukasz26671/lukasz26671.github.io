import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const HEADER_GAP = 16

function headerOffset(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--header-h')
    .trim()
  const parsed = Number.parseFloat(raw)
  return (Number.isFinite(parsed) ? parsed : 64) + HEADER_GAP
}

/** Reset / scroll do #hash po zmianie trasy (SPA nie robi tego wiarygodnie). */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth'

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    let cancelled = false

    const scrollToTarget = () => {
      if (cancelled) return
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset()
      window.scrollTo({ top: Math.max(0, top), behavior })
    }

    // Najpierw top — inaczej zostaje offset z poprzedniej strony (np. deep dive)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTarget)
    })
    const t1 = window.setTimeout(scrollToTarget, 50)
    const t2 = window.setTimeout(scrollToTarget, 200)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [pathname, hash, key])

  return null
}
