import { useNavigate } from 'react-router-dom'

/** Wróć wstecz tylko jeśli poprzedni wpis historii jest z tej samej strony (SPA). */
export function useSiteBack(fallback = '/') {
  const navigate = useNavigate()

  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1)
      return
    }

    const ref = document.referrer
    if (ref && ref.startsWith(window.location.origin)) {
      navigate(-1)
      return
    }

    navigate(fallback)
  }
}
