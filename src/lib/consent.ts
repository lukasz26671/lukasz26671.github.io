/** Cookie / analytics consent (also gates GA). */
export const COOKIE_OK_KEY = 'sn-cookie-ok'

export function hasCookieConsent(): boolean {
  try {
    return localStorage.getItem(COOKIE_OK_KEY) === '1'
  } catch {
    return false
  }
}

export function acceptCookieConsent() {
  try {
    localStorage.setItem(COOKIE_OK_KEY, '1')
  } catch {
    /* ignore */
  }
}
