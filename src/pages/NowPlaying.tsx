import { useAudio } from '../app/AudioProvider'
import { AudioSpinner } from '../components/AudioSpinner'
import { StreamLyricsTabs } from '../components/StreamLyricsTabs'
import {
  IconNext,
  IconPause,
  IconPlay,
  IconPrev,
} from '../components/icons/MediaIcons'
import { useLocale } from '../i18n/LocaleContext'
import { useSiteBack } from '../lib/useSiteBack'
import styles from './NowPlaying.module.css'

export function NowPlayingPage() {
  const {
    current,
    isPlaying,
    toggle,
    next,
    prev,
    openYoutube,
    shareCurrent,
    index,
    playbackIssue,
    playlistName,
    songs,
  } = useAudio()
  const goBack = useSiteBack('/music')
  const { t } = useLocale()

  if (!current) {
    return (
      <div className={`page ${styles.page}`}>
        <button type="button" className={styles.back} onClick={goBack}>
          {t('nowPlaying.back')}
        </button>
        <p className={styles.empty}>{t('nowPlaying.empty')}</p>
      </div>
    )
  }

  return (
    <div className={`page ${styles.page}`}>
      <button type="button" className={styles.back} onClick={goBack}>
        {t('nowPlaying.back')}
      </button>

      <div className={styles.hero}>
        <div className={styles.stage} aria-hidden="true">
          <div className={`${styles.orb} ${isPlaying ? styles.orbLive : ''}`} />
          <div className={styles.rings}>
            <span />
            <span />
            <span />
          </div>
        </div>

        <article className={styles.card}>
          <p className={`mono ${styles.kicker}`}>
            Now playing · {playlistName} ·{' '}
            {index >= 0
              ? `${index + 1}/${songs.length || '—'}`
              : t('nowPlaying.outsidePlaylist')}
          </p>

          <div className={`${styles.eq} ${isPlaying ? styles.eqLive : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <h1 className={styles.title}>{current.title}</h1>
          <p className={styles.author}>{current.author}</p>

          {playbackIssue === 'retrying' && (
            <AudioSpinner className={styles.issue} label={t('nowPlaying.loading')} size="md" />
          )}
          {playbackIssue === 'unavailable' && (
            <p className={`mono ${styles.issueWarn}`}>
              {t('nowPlaying.unavailable', { title: current.title })}{' '}
              <button type="button" className={styles.retry} onClick={openYoutube}>
                {t('nowPlaying.openYoutube')}
              </button>
            </p>
          )}

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.ctrl}
              onClick={prev}
              title={t('nowPlaying.prev')}
              aria-label={t('nowPlaying.prev')}
            >
              <IconPrev />
            </button>
            <button
              type="button"
              className={`${styles.play} ${isPlaying ? styles.playOn : ''}`}
              onClick={toggle}
              title={isPlaying ? t('nowPlaying.pause') : 'Play'}
              aria-label={isPlaying ? t('nowPlaying.pause') : t('nowPlaying.play')}
            >
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>
            <button
              type="button"
              className={styles.ctrl}
              onClick={next}
              title={t('nowPlaying.next')}
              aria-label={t('nowPlaying.next')}
            >
              <IconNext />
            </button>
          </div>

          <div className={styles.links}>
            <button
              type="button"
              className={styles.linkBtn}
              onClick={openYoutube}
              title={t('nowPlaying.watchTitle')}
            >
              {t('nowPlaying.watch')}
            </button>
            <button type="button" className={styles.linkBtn} onClick={() => void shareCurrent()}>
              {t('nowPlaying.share')}
            </button>
          </div>
        </article>
      </div>

      <StreamLyricsTabs className={styles.list} hideStreamActions />
    </div>
  )
}
