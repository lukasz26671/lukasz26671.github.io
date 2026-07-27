import { useEffect } from 'react'
import styles from './Toast.module.css'

type Props = {
  message: string | null
  onDismiss: () => void
  durationMs?: number
}

export function Toast({ message, onDismiss, durationMs = 2200 }: Props) {
  useEffect(() => {
    if (!message) return
    const t = window.setTimeout(onDismiss, durationMs)
    return () => window.clearTimeout(t)
  }, [message, onDismiss, durationMs])

  if (!message) return null

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  )
}
