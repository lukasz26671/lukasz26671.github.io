import styles from './AudioSpinner.module.css'

type Props = {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AudioSpinner({ label, size = 'md', className }: Props) {
  return (
    <span
      className={`${styles.wrap} ${styles[size]} ${className ?? ''}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.ring} aria-hidden="true">
        <span className={styles.dot} />
      </span>
      {label && <span className={`mono ${styles.label}`}>{label}</span>}
    </span>
  )
}
