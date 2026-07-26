import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAudio } from '../app/AudioProvider'
import { AudioSpinner } from '../components/AudioSpinner'
import styles from './RequireAudio.module.css'

export function RequireAudio({ children }: { children: ReactNode }) {
  const { status } = useAudio()
  const location = useLocation()

  if (status === 'checking') {
    return (
      <div className={`page ${styles.wrap}`}>
        <AudioSpinner label="Sprawdzam serwer audio…" size="lg" />
      </div>
    )
  }

  if (status !== 'ready') {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return children
}
