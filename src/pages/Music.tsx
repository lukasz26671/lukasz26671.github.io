import { useAudio } from '../app/AudioProvider'
import { AudioSpinner } from '../components/AudioSpinner'
import { StreamLyricsTabs } from '../components/StreamLyricsTabs'
import { IconPause, IconPlay } from '../components/icons/MediaIcons'
import { useLocale } from '../i18n/LocaleContext'
import { useSiteBack } from '../lib/useSiteBack'
import styles from './Music.module.css'

export function MusicPage() {
  const {
    current,
    isPlaying,
    toggle,
    playbackIssue,
    openYoutube,
    playlistName,
  } = useAudio()
  const goBack = useSiteBack('/')
  const { t } = useLocale()

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={goBack}>
          {t('music.back')}
        </button>
        <p className={`mono ${styles.eyebrow}`}>Stream · {playlistName}</p>
        <h1>{t('music.title')}</h1>
        <p className={styles.lead}>{t('music.lead')}</p>
      </header>

      {current && (
        <section className={styles.now} aria-label={t('music.nowAria')}>
          <div className={styles.nowVisual} aria-hidden="true">
            <div className={`${styles.eq} ${isPlaying ? styles.eqLive : ''}`}>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={styles.nowBody}>
            <p className={`mono ${styles.nowLabel}`}>{t('music.nowPlaying')}</p>
            <h2 className={styles.nowTitle}>{current.title}</h2>
            <p className={styles.nowAuthor}>{current.author}</p>

            {playbackIssue === 'retrying' && (
              <AudioSpinner className={styles.issue} label={t('music.loading')} size="md" />
            )}
            {playbackIssue === 'unavailable' && (
              <p className={`mono ${styles.issueWarn}`}>
                {t('music.unavailable', { title: current.title })}{' '}
                <button type="button" className={styles.retry} onClick={openYoutube}>
                  {t('music.listenYoutube')}
                </button>
              </p>
            )}
          </div>

          <button
            type="button"
            className={`${styles.nowPlay} ${isPlaying ? styles.nowPlayOn : ''}`}
            onClick={toggle}
            aria-label={isPlaying ? t('music.pause') : t('music.play')}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
        </section>
      )}

      <StreamLyricsTabs />
    </div>
  )
}
