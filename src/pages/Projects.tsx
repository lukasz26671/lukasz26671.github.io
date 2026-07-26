import { projects } from '../data/projects'
import { ProjectCard } from '../components/ProjectCard'

export function ProjectsPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Projekty</h1>
        <p>
          Wybrane publiczne repozytoria z{' '}
          <a href="https://github.com/lukasz26671?tab=repositories" target="_blank" rel="noreferrer">
            GitHuba
          </a>
          . Nie zawiera wszystkich projektów - część jest prywatna lub historyczna.
        </p>
      </header>
      <div className="grid-projects">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  )
}
