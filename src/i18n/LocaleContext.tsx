import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PREF_LOCALE, readPref, writePref } from '../lib/prefs'
import { catalogs, translate, translateList } from './translate'
import type { Locale } from './types'

type Params = Record<string, string | number>

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (path: string, params?: Params) => string
  tList: (path: string) => string[]
}

const LocaleCtx = createContext<LocaleContextValue | null>(null)

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'pl'
  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean)
  for (const raw of candidates) {
    if (raw.toLowerCase().startsWith('pl')) return 'pl'
  }
  return 'en'
}

function readInitialLocale(): Locale {
  const stored = readPref(PREF_LOCALE, '')
  if (stored === 'pl' || stored === 'en') return stored
  return detectBrowserLocale()
}

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale
  const meta = document.querySelector('meta[name="description"]')
  if (meta) {
    meta.setAttribute('content', catalogs[locale].meta.description)
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  useEffect(() => {
    applyDocumentLocale(locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    writePref(PREF_LOCALE, next)
  }, [])

  const t = useCallback(
    (path: string, params?: Params) => translate(locale, path, params),
    [locale],
  )

  const tList = useCallback(
    (path: string) => translateList(locale, path),
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t, tList }),
    [locale, setLocale, t, tList],
  )

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleCtx)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

/** For non-React code (e.g. AudioProvider prompt). */
export function getStoredLocale(): Locale {
  const stored = readPref(PREF_LOCALE, '')
  if (stored === 'pl' || stored === 'en') return stored
  return detectBrowserLocale()
}
