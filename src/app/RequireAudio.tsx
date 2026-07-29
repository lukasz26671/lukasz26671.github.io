import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAudio } from '../app/AudioProvider'
import { AudioSpinner } from '../components/AudioSpinner'
import { useLocale } from '../i18n/LocaleContext'
import styles from './RequireAudio.module.css'

export function RequireAudio({ children }: { children: ReactNode }) {
  const { status } = useAudio()
  const location = useLocation()
  const { t } = useLocale()

  if (status === 'checking') {
    return (
      <div className={`page ${styles.wrap}`}>
        <AudioSpinner label={t('audio.checking')} size="lg" />
      </div>
    )
  }

  if (status !== 'ready') {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return children
}
