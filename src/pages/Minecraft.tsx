export function MinecraftPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Minecraft</h1>
        <p>Mod utils spod znaku Lukasz26671 — klasyczny 1.7.10.</p>
      </header>
      <article className="glass" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Lukasz26671 Utils Mod (1.7.10)</h2>
        <p style={{ color: 'var(--sn-text-secondary)', marginBottom: '1.25rem' }}>
          Narzędzia i udogodnienia do Minecrafta. Poboczny projekt, od tego zaczynałem programować :)
        </p>
        <div className="cta-row">
          <a
            className="btn btn-primary"
            href="https://github.com/lukasz26671/Lukasz26671Utils/releases"
            target="_blank"
            rel="noreferrer"
          >
            Pobierz release
          </a>
          <a
            className="btn btn-ghost"
            href="https://github.com/lukasz26671/Lukasz26671Utils"
            target="_blank"
            rel="noreferrer"
          >
            Repo
          </a>
        </div>
      </article>
    </div>
  )
}
