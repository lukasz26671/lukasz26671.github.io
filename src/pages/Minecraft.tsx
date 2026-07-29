import { useLocale } from '../i18n/LocaleContext'

export function MinecraftPage() {
  const { t } = useLocale()

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('minecraft.title')}</h1>
        <p>{t('minecraft.lead')}</p>
      </header>
      <article className="glass" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>{t('minecraft.modTitle')}</h2>
        <p style={{ color: 'var(--sn-text-secondary)', marginBottom: '1.25rem' }}>
          {t('minecraft.body')}
        </p>
        <div className="cta-row">
          <a
            className="btn btn-primary"
            href="https://github.com/lukasz26671/Lukasz26671Utils/releases"
            target="_blank"
            rel="noreferrer"
          >
            {t('minecraft.download')}
          </a>
          <a
            className="btn btn-ghost"
            href="https://github.com/lukasz26671/Lukasz26671Utils"
            target="_blank"
            rel="noreferrer"
          >
            {t('minecraft.repo')}
          </a>
        </div>
      </article>
    </div>
  )
}
