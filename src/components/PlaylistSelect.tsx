import { useEffect, useId, useRef, useState } from 'react'
import styles from './PlaylistSelect.module.css'

type Props = {
  value: string
  options: string[]
  onChange: (value: string) => void
  label?: string
  className?: string
  /** Jedna linia — lepsze na wąskim docku mobilnym */
  compact?: boolean
}

export function PlaylistSelect({
  value,
  options,
  onChange,
  label = 'Playlista',
  className,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${open ? styles.open : ''} ${compact ? styles.compact : ''} ${className ?? ''}`}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`mono ${styles.kicker}`}>{label}</span>
        <span className={styles.value}>{value}</span>
        <span className={styles.chev} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul id={listId} className={styles.menu} role="listbox" aria-label={label}>
          {options.map((opt) => {
            const selected = opt === value
            return (
              <li key={opt} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`${styles.option} ${selected ? styles.selected : ''}`}
                  onClick={() => {
                    onChange(opt)
                    setOpen(false)
                  }}
                >
                  <span>{opt}</span>
                  {selected && <span className={`mono ${styles.mark}`}>●</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
