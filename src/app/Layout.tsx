import { Outlet } from 'react-router-dom'
import { useAudio } from './AudioProvider'
import { ScrollManager } from './ScrollManager'
import { ScrollDepthStyle } from './ScrollDepthStyle'
import { SiteHeader } from '../components/SiteHeader'
import { SiteBackground } from '../components/SiteBackground'
import { PlayerDock } from '../components/PlayerDock'
import { CookieNotice } from '../components/CookieNotice'

export function Layout() {
  const { status } = useAudio()
  const withPlayer = status === 'ready'

  return (
    <div className={`app-shell ${withPlayer ? 'with-player' : ''}`}>
      <ScrollManager />
      <ScrollDepthStyle />
      <SiteBackground />
      <SiteHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <PlayerDock />
      <CookieNotice />
      <footer className="site-footer">
        © {new Date().getFullYear()} Lukasz26671
      </footer>
    </div>
  )
}
