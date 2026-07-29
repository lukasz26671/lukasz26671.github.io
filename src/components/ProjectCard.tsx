import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { useLocale } from '../i18n/LocaleContext'
import { localize, localizeList } from '../i18n/types'
import styles from './ProjectCard.module.css'

type Props = {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: Props) {
  const { locale, t } = useLocale()
  const isInternalMore = project.moreUrl?.startsWith('/')
  const tags = localizeList(locale, project.tags)

  return (
    <article
      className={`glass ${styles.card} ${project.commercial ? styles.commercial : ''} ${className ?? ''}`}
    >
      <div className={styles.top}>
        <span className={`mono ${styles.lang}`}>{localize(locale, project.language)}</span>
        {tags.slice(0, 2).map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.desc}>{localize(locale, project.description)}</p>
      <div className={styles.links}>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            {t('project.github')}
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target={project.liveUrl.startsWith('/') ? undefined : '_blank'}
            rel={project.liveUrl.startsWith('/') ? undefined : 'noreferrer'}
          >
            {t('project.live')}
          </a>
        )}
        {project.moreUrl &&
          (isInternalMore ? (
            <Link to={project.moreUrl}>{t('project.more')}</Link>
          ) : (
            <a href={project.moreUrl} target="_blank" rel="noreferrer">
              {t('project.more')}
            </a>
          ))}
      </div>
    </article>
  )
}
