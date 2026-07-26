import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAudio } from '../app/AudioProvider'

export function RequireAudio({ children }: { children: ReactNode }) {
  const { status } = useAudio()
  const location = useLocation()

  if (status === 'checking') {
    return (
      <div className="page">
        <p style={{ color: 'var(--sn-text-secondary)' }}>Sprawdzam serwer audio…</p>
      </div>
    )
  }

  if (status !== 'ready') {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return children
}
