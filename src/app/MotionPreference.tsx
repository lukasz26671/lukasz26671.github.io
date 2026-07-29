import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Locale } from '../i18n/types'
import { catalogs } from '../i18n/translate'

export type MotionMode = 'system' | 'full' | 'reduce'

type MotionContextValue = {
  mode: MotionMode
  /** Efektywne reduced (system lub override) */
  reducedMotion: boolean
  systemPrefersReduce: boolean
  setMode: (mode: MotionMode) => void
  cycleMode: () => void
}

const STORAGE_KEY = 'sn-motion-mode'
const MotionCtx = createContext<MotionContextValue | null>(null)

function readStoredMode(): MotionMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'system' || raw === 'full' || raw === 'reduce') return raw
  } catch {
    /* ignore */
  }
  return 'system'
}

function readSystemPrefersReduce(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<MotionMode>(readStoredMode)
  const [systemPrefersReduce, setSystemPrefersReduce] = useState(readSystemPrefersReduce)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setSystemPrefersReduce(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const reducedMotion =
    mode === 'reduce' ? true : mode === 'full' ? false : systemPrefersReduce

  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduce' : 'full'
  }, [reducedMotion])

  const setMode = useCallback((next: MotionMode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const cycleMode = useCallback(() => {
    setMode(mode === 'system' ? 'reduce' : mode === 'reduce' ? 'full' : 'system')
  }, [mode, setMode])

  const value = useMemo(
    () => ({
      mode,
      reducedMotion,
      systemPrefersReduce,
      setMode,
      cycleMode,
    }),
    [mode, reducedMotion, systemPrefersReduce, setMode, cycleMode],
  )

  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>
}

export function useMotionPreference() {
  const ctx = useContext(MotionCtx)
  if (!ctx) throw new Error('useMotionPreference must be used within MotionProvider')
  return ctx
}

export function motionModeLabel(mode: MotionMode, locale: Locale = 'pl'): string {
  const m = catalogs[locale].motion
  if (mode === 'reduce') return m.reduce
  if (mode === 'full') return m.full
  return m.system
}
