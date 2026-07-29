import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAudio } from './AudioProvider'
import { ScrollManager } from './ScrollManager'
import { ScrollDepthStyle } from './ScrollDepthStyle'
import { SiteHeader } from '../components/SiteHeader'
import { SiteBackground } from '../components/SiteBackground'
import { PlayerDock } from '../components/PlayerDock'
import { CookieNotice } from '../components/CookieNotice'
import { Toast } from '../components/Toast'
import { useLocale } from '../i18n/LocaleContext'

const DOCK_KEY = 'sn-player-dock-collapsed'
const MOBILE_MQ = '(max-width: 720px)'

function readDockCollapsed(): boolean {
  try {
    if (typeof window !== 'undefined' && !window.matchMedia(MOBILE_MQ).matches) {
      return false
    }
    return localStorage.getItem(DOCK_KEY) === '1'
  } catch {
    return false
  }
}

export function Layout() {
  const { status } = useAudio()
  const { t } = useLocale()
  const withPlayer = status === 'ready'
  const [dockCollapsed, setDockCollapsed] = useState(readDockCollapsed)
  const [offlineToast, setOfflineToast] = useState<string | null>(null)
  const prevStatus = useRef(status)
  const dismissOfflineToast = useCallback(() => setOfflineToast(null), [])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const sync = () => {
      if (!mq.matches) setDockCollapsed(false)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(DOCK_KEY, dockCollapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [dockCollapsed])

  useEffect(() => {
    if (prevStatus.current === 'ready' && status === 'unavailable') {
      setOfflineToast(t('layout.audioOffline'))
    }
    prevStatus.current = status
  }, [status, t])

  return (
    <div
      className={`app-shell ${withPlayer ? 'with-player' : ''} ${withPlayer && dockCollapsed ? 'player-collapsed' : ''}`}
    >
      <ScrollManager />
      <ScrollDepthStyle />
      <SiteBackground />
      <SiteHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <PlayerDock collapsed={dockCollapsed} onCollapsedChange={setDockCollapsed} />
      <Toast
        message={offlineToast}
        onDismiss={dismissOfflineToast}
        tone="danger"
        durationMs={4200}
      />
      <CookieNotice />
      <footer className="site-footer">
        © {new Date().getFullYear()} Lukasz26671
      </footer>
    </div>
  )
}
