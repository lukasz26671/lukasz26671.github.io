import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type DiveContextValue = {
  progress: number
  setProgress: (value: number) => void
}

const DiveContext = createContext<DiveContextValue | null>(null)

export function DiveProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState(0)
  const setProgress = useCallback((value: number) => {
    setProgressState(Math.min(1, Math.max(0, value)))
  }, [])

  const value = useMemo(
    () => ({ progress, setProgress }),
    [progress, setProgress],
  )

  return <DiveContext.Provider value={value}>{children}</DiveContext.Provider>
}

export function useDive() {
  const ctx = useContext(DiveContext)
  if (!ctx) throw new Error('useDive must be used within DiveProvider')
  return ctx
}
