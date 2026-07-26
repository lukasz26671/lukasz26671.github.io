import type { Project } from '../data/projects'
import styles from './ProjectCard.module.css'

type Props = {
  project: Project
}

export function ProjectCard({ project }: Props) {
  return (
    <article className={`glass ${styles.card}`}>
      <div className={styles.top}>
        <span className={`mono ${styles.lang}`}>{project.language}</span>
        {project.tags?.slice(0, 2).map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.desc}>{project.description}</p>
      <div className={styles.links}>
        <a href={project.repoUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target={project.liveUrl.startsWith('/') ? undefined : '_blank'}
            rel={project.liveUrl.startsWith('/') ? undefined : 'noreferrer'}
          >
            Live
          </a>
        )}
      </div>
    </article>
  )
}
