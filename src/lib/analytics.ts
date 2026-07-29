import { hasCookieConsent } from './consent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() ?? ''

let loaded = false

export function isAnalyticsConfigured(): boolean {
  return /^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID)
}

/** Load gtag.js and configure GA4. No-op without consent or a valid measurement ID. */
export function initAnalytics() {
  if (loaded || !isAnalyticsConfigured() || !hasCookieConsent()) return
  loaded = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function trackPageView(path: string) {
  if (!loaded || !isAnalyticsConfigured()) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
