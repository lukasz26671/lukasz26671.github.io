import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AudioProvider } from './app/AudioProvider'
import { DiveProvider } from './app/DiveContext'
import { MotionProvider } from './app/MotionPreference'
import { LocaleProvider } from './i18n/LocaleContext'
import { Layout } from './app/Layout'
import { RequireAudio } from './app/RequireAudio'
import { Analytics } from './components/Analytics'
import { HomePage } from './pages/Home'
import { AboutPage } from './pages/About'
import { TimelinePage } from './pages/Timeline'
import { LabsPage } from './pages/Labs'
import { MinecraftPage } from './pages/Minecraft'
import { SourcesPage } from './pages/Sources'
import { MusicPage } from './pages/Music'
import { NowPlayingPage } from './pages/NowPlaying'

export default function App() {
  return (
    <MotionProvider>
      <LocaleProvider>
        <AudioProvider>
          <BrowserRouter>
            <Analytics />
            <DiveProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="projects" element={<Navigate to="/#projects" replace />} />
                  <Route path="timeline" element={<TimelinePage />} />
                  <Route path="labs" element={<LabsPage />} />
                  <Route path="minecraft" element={<MinecraftPage />} />
                  <Route path="sources" element={<SourcesPage />} />
                  <Route
                    path="music"
                    element={
                      <RequireAudio>
                        <MusicPage />
                      </RequireAudio>
                    }
                  />
                  <Route
                    path="now-playing"
                    element={
                      <RequireAudio>
                        <NowPlayingPage />
                      </RequireAudio>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </DiveProvider>
          </BrowserRouter>
        </AudioProvider>
      </LocaleProvider>
    </MotionProvider>
  )
}
