import { useEffect, useState } from 'react'
import styles from './CookieNotice.module.css'

const KEY = 'sn-cookie-ok'

export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className={styles.bar} role="dialog" aria-label="Informacja o cookies">
      <p>
        Korzystając z tej strony zgadzasz się na pliki cookies oraz (opcjonalnie) Google Analytics.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          localStorage.setItem(KEY, '1')
          setVisible(false)
        }}
      >
        OK
      </button>
    </div>
  )
}
