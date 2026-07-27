import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAudio } from '../app/AudioProvider'
import { AudioSpinner } from './AudioSpinner'
import { PlaylistSelect } from './PlaylistSelect'
import { Toast } from './Toast'
import { TrackSearchLinks } from './TrackSearchLinks'
import {
  IconChevronDown,
  IconChevronUp,
  IconLoop,
  IconNext,
  IconPause,
  IconPlay,
  IconPrev,
  IconShare,
  IconShuffle,
  IconVolume,
} from './icons/MediaIcons'
import styles from './PlayerDock.module.css'

type Props = {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function PlayerDock({ collapsed, onCollapsedChange }: Props) {
  const {
    status,
    current,
    isPlaying,
    shuffle,
    loop,
    volume,
    playlistName,
    playlistNames,
    playbackIssue,
    toggle,
    next,
    prev,
    setShuffle,
    setLoop,
    setVolume,
    setPlaylistName,
    openYoutube,
    shareCurrent,
  } = useAudio()
  const [toast, setToast] = useState<string | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])

  const onShare = useCallback(async () => {
    await shareCurrent()
    setToast('Link skopiowany do schowka')
  }, [shareCurrent])

  if (status !== 'ready' || !current) return null

  if (collapsed) {
    return (
      <>
        <div className={styles.mini} role="region" aria-label="Odtwarzacz (zwinięty)">
          <button
            type="button"
            className={`${styles.miniPlay} ${isPlaying ? styles.playOn : ''}`}
            onClick={toggle}
            title={isPlaying ? 'Pauza' : 'Play'}
            aria-label={isPlaying ? 'Pauza' : 'Odtwórz'}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <Link to="/now-playing" className={styles.miniTrack}>
            <span className={styles.miniTitle}>{current.title}</span>
            <span className={styles.miniAuthor}>{current.author}</span>
          </Link>
          <button
            type="button"
            className={styles.miniExpand}
            onClick={() => onCollapsedChange(false)}
            title="Pokaż odtwarzacz"
            aria-label="Pokaż odtwarzacz"
          >
            <IconChevronUp />
          </button>
        </div>
        <Toast message={toast} onDismiss={dismissToast} />
      </>
    )
  }

  return (
    <>
      <div className={styles.dock} role="region" aria-label="Odtwarzacz audio">
        <div className={styles.left}>
          <div className={`${styles.eq} ${isPlaying ? styles.eqLive : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <Link to="/now-playing" className={styles.track}>
            <span className={styles.author}>{current.author}</span>
            <span className={styles.title}>{current.title}</span>
            {playbackIssue === 'retrying' && (
              <AudioSpinner className={styles.notice} label="Ładowanie" size="sm" />
            )}
            {playbackIssue === 'unavailable' && (
              <span className={`mono ${styles.noticeWarn}`}>
                Niedostępny
                <button
                  type="button"
                  className={styles.retryInline}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openYoutube()
                  }}
                >
                  YouTube
                </button>
              </span>
            )}
          </Link>

          <PlaylistSelect
            value={playlistName}
            options={playlistNames}
            onChange={setPlaylistName}
            className={styles.desktopPlaylist}
          />
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={shuffle ? styles.on : undefined}
            onClick={() => setShuffle(!shuffle)}
            aria-pressed={shuffle}
            title="Shuffle"
            aria-label="Shuffle"
          >
            <IconShuffle />
          </button>
          <button type="button" onClick={prev} title="Poprzedni" aria-label="Poprzedni">
            <IconPrev />
          </button>
          <button
            type="button"
            className={`${styles.play} ${isPlaying ? styles.playOn : ''}`}
            onClick={toggle}
            title={isPlaying ? 'Pauza' : 'Play'}
            aria-label={isPlaying ? 'Pauza' : 'Odtwórz'}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button type="button" onClick={next} title="Następny" aria-label="Następny">
            <IconNext />
          </button>
          <button
            type="button"
            className={loop ? styles.on : undefined}
            onClick={() => setLoop(!loop)}
            aria-pressed={loop}
            title="Loop"
            aria-label="Loop"
          >
            <IconLoop />
          </button>
        </div>

        <div className={styles.right}>
          <TrackSearchLinks song={current} compact className={styles.searchLinks} />
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => void onShare()}
            title="Udostępnij"
            aria-label="Udostępnij — skopiuj link"
          >
            <IconShare />
          </button>
          <label className={styles.vol} title="Głośność aplikacji">
            <IconVolume className={styles.volIcon} />
            <span className="sr-only">Głośność</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
            />
          </label>
        </div>

        <PlaylistSelect
          value={playlistName}
          options={playlistNames}
          onChange={setPlaylistName}
          compact
          className={styles.mobilePlaylist}
        />

        <button
          type="button"
          className={styles.collapse}
          onClick={() => onCollapsedChange(true)}
          title="Ukryj odtwarzacz"
          aria-label="Ukryj odtwarzacz"
        >
          <IconChevronDown />
        </button>

        <button
          type="button"
          className={styles.mobileShare}
          onClick={() => void onShare()}
          title="Udostępnij"
          aria-label="Udostępnij — skopiuj link"
        >
          <IconShare />
        </button>
      </div>
      <Toast message={toast} onDismiss={dismissToast} />
    </>
  )
}
