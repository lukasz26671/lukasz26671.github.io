import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { hasCookieConsent } from '../lib/consent'
import { initAnalytics, trackPageView } from '../lib/analytics'

/** Consent-gated GA4 page views for the SPA. */
export function Analytics() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (!hasCookieConsent()) return
    initAnalytics()
  }, [])

  useEffect(() => {
    if (!hasCookieConsent()) return
    initAnalytics()
    trackPageView(`${pathname}${search}${hash}`)
  }, [pathname, search, hash])

  return null
}
