import { hasCookieConsent } from './consent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() ?? ''

let booted = false

export function isAnalyticsConfigured(): boolean {
  return /^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID)
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag === 'function') return

  // Google’s queue expects the Arguments object (not a rest-param array).
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
}

/** Load gtag.js and configure GA4. No-op without consent or a valid measurement ID. */
export function initAnalytics() {
  if (booted || !isAnalyticsConfigured() || !hasCookieConsent()) return
  booted = true

  ensureGtagStub()
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function trackPageView(path: string) {
  if (!booted || !isAnalyticsConfigured() || typeof window.gtag !== 'function') return
  window.gtag('config', MEASUREMENT_ID, {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  })
}
