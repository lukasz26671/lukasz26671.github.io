import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useDive } from '../app/DiveContext'
import { projects, getCommercialLinkedPair, getCommercialStandalone } from '../data/projects'
import { ProjectCard } from '../components/ProjectCard'
import styles from './Home.module.css'

export function HomePage() {
  const { progress, setProgress } = useDive()
  const trackRef = useRef<HTMLDivElement>(null)
  const deepRef = useRef<HTMLElement>(null)
  const [signOnGlass, sentinel] = getCommercialLinkedPair()
  const commercialSolo = getCommercialStandalone()

  useEffect(() => {
    // reduced-motion: bez Three.js, ale dive progress nadal napędza statyczną scenę
    const onScroll = () => {
      const track = trackRef.current
      const deep = deepRef.current
      if (!track) return
      const viewH = window.innerHeight
      const trackRect = track.getBoundingClientRect()

      let raw = (viewH - trackRect.top) / (trackRect.height + viewH * 0.1)

      if (deep) {
        const deepRect = deep.getBoundingClientRect()
        if (deepRect.top < viewH * 0.85) {
          const deepPull = 1 - deepRect.top / (viewH * 0.85)
          raw = Math.max(raw, Math.min(1, 0.65 + deepPull * 0.35))
        }
        if (deepRect.top < viewH * 0.35) raw = 1
      }

      setProgress(raw)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      setProgress(0)
    }
  }, [setProgress])

  const contentOpacity = Math.max(0, 1 - progress * 1.35)
  const contentY = progress * 28
  const deepOpacity = Math.min(1, Math.max(0, (progress - 0.45) / 0.4))
  const deepY = (1 - deepOpacity) * 36

  const scrollToDeep = () => {
    deepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (window.location.hash !== '#projects') {
      history.replaceState(null, '', '#projects')
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div
          className={styles.content}
          style={{
            opacity: contentOpacity,
            transform: `translateY(${contentY}px)`,
            pointerEvents: contentOpacity < 0.15 ? 'none' : undefined,
          }}
        >
          <p className={`mono ${styles.eyebrow}`}>Full-stack · .NET · Blazor · React</p>
          <h1 className={styles.brand}>Lukasz26671</h1>
          <p className={styles.lead}>
            Tworzę aplikacje, które łączą świat kodu z realnymi procesami. Od własnych projektów
            webowych po systemy biznesowe i rozwiązania przemysłowe — i dobrze się przy tym bawię
            :)
          </p>

          <div className="cta-row">
            <button type="button" className="btn btn-primary" onClick={scrollToDeep}>
              Deep dive — projekty
            </button>
            <Link to="/about" className="btn btn-ghost">
              O mnie
            </Link>
          </div>

          <p className={`mono ${styles.scrollHint}`}>scroll ↓</p>
        </div>
      </section>

      <div ref={trackRef} className={styles.diveTrack} aria-hidden="true" />

      <section
        id="projects"
        ref={deepRef}
        className={styles.deep}
        style={{
          opacity: deepOpacity,
          transform: `translateY(${deepY}px)`,
        }}
      >
        <header className={styles.deepHeader}>
          <p className={`mono ${styles.deepEyebrow}`}>Deep dive</p>
          <h2>Projekty</h2>
          <p>
            To, co warto pokazać.
          </p>
        </header>

        <div className={`grid-projects ${styles.deepGrid}`}>
          <div className={styles.linkedPair}>
            <div className={styles.linkedBody}>
              <ProjectCard project={signOnGlass} className={styles.linkedCard} />
              <div className={styles.linkedBridge} aria-hidden="true">
                <span className={styles.linkedDot} />
                <span className={styles.linkedLine} />
                <svg
                  className={styles.linkedGlyph}
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5.5" cy="12" r="2.4" />
                  <circle cx="18.5" cy="12" r="2.4" />
                  <path d="M8.2 12h7.6" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className={styles.linkedLine} />
                <span className={styles.linkedDot} />
              </div>
              <ProjectCard project={sentinel} className={styles.linkedCard} />
            </div>
          </div>
          {commercialSolo.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        <div className={styles.deepFooter}>
          <a
            href="https://github.com/lukasz26671?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            Wszystkie na GitHubie
          </a>
          <Link to="/about#commercial" className="btn btn-primary">
            Więcej o komercyjnych
          </Link>
        </div>
      </section>
    </div>
  )
}
