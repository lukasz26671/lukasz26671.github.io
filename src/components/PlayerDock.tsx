import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAudio } from '../app/AudioProvider'
import { useLocale } from '../i18n/LocaleContext'
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
  const { t } = useLocale()
  const [toast, setToast] = useState<string | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])

  const onShare = useCallback(async () => {
    await shareCurrent()
    setToast(t('player.linkCopied'))
  }, [shareCurrent, t])

  if (status !== 'ready' || !current) return null

  if (collapsed) {
    return (
      <>
        <div className={styles.mini} role="region" aria-label={t('player.miniAria')}>
          <button
            type="button"
            className={`${styles.miniPlay} ${isPlaying ? styles.playOn : ''}`}
            onClick={toggle}
            title={isPlaying ? t('player.pause') : 'Play'}
            aria-label={isPlaying ? t('player.pause') : t('player.play')}
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
            title={t('player.show')}
            aria-label={t('player.show')}
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
      <div className={styles.dock} role="region" aria-label={t('player.dockAria')}>
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
              <AudioSpinner className={styles.notice} label={t('player.loading')} size="sm" />
            )}
            {playbackIssue === 'unavailable' && (
              <span className={`mono ${styles.noticeWarn}`}>
                {t('player.unavailable')}
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
            label={t('player.playlist')}
            className={styles.desktopPlaylist}
          />
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={shuffle ? styles.on : undefined}
            onClick={() => setShuffle(!shuffle)}
            aria-pressed={shuffle}
            title={t('player.shuffle')}
            aria-label={t('player.shuffle')}
          >
            <IconShuffle />
          </button>
          <button type="button" onClick={prev} title={t('player.prev')} aria-label={t('player.prev')}>
            <IconPrev />
          </button>
          <button
            type="button"
            className={`${styles.play} ${isPlaying ? styles.playOn : ''}`}
            onClick={toggle}
            title={isPlaying ? t('player.pause') : 'Play'}
            aria-label={isPlaying ? t('player.pause') : t('player.play')}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button type="button" onClick={next} title={t('player.next')} aria-label={t('player.next')}>
            <IconNext />
          </button>
          <button
            type="button"
            className={loop ? styles.on : undefined}
            onClick={() => setLoop(!loop)}
            aria-pressed={loop}
            title={t('player.loop')}
            aria-label={t('player.loop')}
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
            title={t('player.share')}
            aria-label={t('player.shareAria')}
          >
            <IconShare />
          </button>
          <label className={styles.vol} title={t('player.volumeTitle')}>
            <IconVolume className={styles.volIcon} />
            <span className="sr-only">{t('player.volume')}</span>
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
          label={t('player.playlist')}
          compact
          className={styles.mobilePlaylist}
        />

        <button
          type="button"
          className={styles.collapse}
          onClick={() => onCollapsedChange(true)}
          title={t('player.hide')}
          aria-label={t('player.hide')}
        >
          <IconChevronDown />
        </button>

        <button
          type="button"
          className={styles.mobileShare}
          onClick={() => void onShare()}
          title={t('player.share')}
          aria-label={t('player.shareAria')}
        >
          <IconShare />
        </button>
      </div>
      <Toast message={toast} onDismiss={dismissToast} />
    </>
  )
}
