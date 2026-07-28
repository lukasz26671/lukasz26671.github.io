import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import styles from './Labs.module.css'

type LineKind = 'prompt' | 'out' | 'ok' | 'err' | 'accent'

type LogLine = {
  text: string
  kind: LineKind
}

const COMMANDS = [
  'hello',
  'help',
  'clear',
  'whoami',
  'ls',
  'date',
  'uptime',
  'stack',
  'projects',
  'fortune',
  'neofetch',
  'cowsay',
  'echo',
  'ping',
  'github',
  'minecraft',
  'music',
  'sudo',
  'history',
  'coffee',
  'kawa',
  '404',
  'dotnet',
  'git',
  'npm',
  'exit',
] as const

const FORTUNES = [
  'Compile succeeded. Ship it.',
  'Najlepszy kod to ten, którego nie musisz pisać drugi raz.',
  'Blazor Server czeka cierpliwie. Ty też możesz.',
  '404: Motywacja not found - spróbuj ponownie po kawie.',
  'Refactor albo żałuj. Czasem oba naraz.',
  'Three.js: bo płaskie portfolio to za mało głębi.',
  'git push --force && ... nie, dziękuję.',
  'NullReferenceException? Znajome...',
  'Minecraft 1.7.10 - tam wszystko się zaczęło.',
  'sudo make me a sandwich — brak uprawnień, ale dobra próba.',
]

function formatUptime(bootMs: number) {
  const s = Math.floor((Date.now() - bootMs) / 1000)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}m ${r}s`
}

function buildNeofetch(bootMs: number) {
  return `
  lukasz26671@site
  ---------------------
  OS: Windows / Linux / macOS (Twój wybór)
  Shell: labs-terminal v0.2
  Stack: .NET · Blazor · React · Rust
  Site: lukasz26671.github.io
  Uptime: ${formatUptime(bootMs)}
  Coffee: ${Math.random() > 0.5 ? '☕ tak' : '☕ nie'}
`.trim()
}

function cowsay(msg: string) {
  const text = msg || 'moo'
  const pad = ' '.repeat(Math.max(0, text.length))
  return [
    ` ${pad.replace(/ /g, '_')} `,
    `< ${text} >`,
    ` ${pad.replace(/ /g, '-')} `,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ]
}

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function line(text: string, kind: LineKind = 'out'): LogLine {
  return { text, kind }
}

export function LabsPage() {
  const navigate = useNavigate()
  const boot = useRef(Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const [log, setLog] = useState<LogLine[]>([
    line('> labs ready — wpisz help', 'prompt'),
    line('tip: strzałki ↑↓ historia, Tab uzupełnia', 'accent'),
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)

  const append = useCallback((lines: LogLine[]) => {
    setLog((prev) => [...prev, ...lines].slice(-60))
  }, [])

  const run = useCallback(
    (cmd: string) => {
      const raw = cmd.trim()
      if (!raw) return

      const c = raw.toLowerCase()
      const args = raw.slice(c.indexOf(' ') + 1).trim()
      const lines: LogLine[] = [line(`> ${raw}`, 'prompt')]

      if (c === 'hello' || c === 'hello world') {
        lines.push(line('Hello World!', 'ok'))
        window.alert('Hello World!')
      } else if (c === 'help') {
        lines.push(
          line('komendy:', 'accent'),
          line('  hello · help · clear · whoami · history'),
          line('  ls · date · uptime · stack · projects · fortune'),
          line('  neofetch · cowsay <tekst> · echo <tekst> · ping'),
          line('  github · minecraft · music · coffee · 404'),
          line('  dotnet · git · npm · sudo · exit'),
        )
      } else if (c === 'whoami') {
        lines.push(line('lukasz26671 - full-stack .NET / Blazor / React'))
        lines.push(line('strona z głębią i własnym playerem audio', 'accent'))
      } else if (c === 'clear') {
        setLog([])
        setInput('')
        setHistIdx(-1)
        return
      } else if (c === 'ls' || c === 'dir') {
        lines.push(line('./', 'accent'))
        ;['/about', '/timeline', '/labs', '/minecraft', '/sources', '/music', '/#projects'].forEach(
          (p) => lines.push(line(`  ${p}`)),
        )
      } else if (c === 'date') {
        lines.push(line(new Date().toLocaleString('pl-PL')))
      } else if (c === 'uptime') {
        lines.push(line(`terminal online: ${formatUptime(boot.current)} (od wejścia na /labs)`))
      } else if (c === 'stack' || c === 'tech') {
        lines.push(line('.NET · C# · Blazor · React · TypeScript · Rust · Java', 'ok'))
        lines.push(line('Three.js · Vite · CSS modules · GitHub Pages'))
      } else if (c === 'projects') {
        projects.slice(0, 6).forEach((p) => {
          lines.push(line(`  ${p.name} - ${p.language}`, 'accent'))
        })
        lines.push(line(`  … i ${Math.max(0, projects.length - 6)} więcej na /#projects`))
      } else if (c === 'fortune') {
        lines.push(line(pick(FORTUNES), 'ok'))
      } else if (c === 'neofetch') {
        buildNeofetch(boot.current).split('\n').forEach((l) => lines.push(line(l)))
      } else if (c.startsWith('cowsay')) {
        cowsay(args || 'moo').forEach((l) => lines.push(line(l, 'accent')))
      } else if (c.startsWith('echo ')) {
        lines.push(line(args || ''))
      } else if (c === 'echo') {
        lines.push(line('echo czego? np. echo hello world'))
      } else if (c.startsWith('ping')) {
        const target = args || 'lukasz26671.github.io'
        lines.push(line(`PING ${target}: 42 bytes`, 'accent'))
        lines.push(line(`Reply from ${target}: time=12ms`, 'ok'))
        lines.push(line(`Reply from ${target}: time=9ms`, 'ok'))
        lines.push(line('Ping statistics — 0% packet loss. Portfolio reachable.'))
      } else if (c === 'github') {
        lines.push(line('https://github.com/lukasz26671', 'ok'))
        window.open('https://github.com/lukasz26671', '_blank', 'noopener,noreferrer')
      } else if (c === 'minecraft') {
        lines.push(line('Lukasz26671Utils — mod 1.7.10, tam zaczęła się przygoda z kodem', 'accent'))
        lines.push(line('-> /minecraft'))
      } else if (c === 'music') {
        lines.push(line('Własny player audio i playlisty — sekcja /music', 'accent'))
        lines.push(line('(wymaga cookies / audio — jak reszta playera)'))
      } else if (c.startsWith('sudo')) {
        lines.push(line('lukasz26671 is not in the sudoers file.', 'err'))
        lines.push(line('Ale doceniam ambicję.', 'accent'))
      } else if (c === 'history') {
        if (history.length === 0) {
          lines.push(line('(pusto - wpisz coś najpierw)'))
        } else {
          history.forEach((h, i) => lines.push(line(`  ${i + 1}  ${h}`)))
        }
      } else if (c === 'coffee' || c === 'kawa') {
        lines.push(line('☕  Brewing… done.', 'ok'))
        lines.push(line('Productivity +15. Refactoring urge +300.'))
      } else if (c === '404') {
        lines.push(line('   _  _    ___  _  _ ', 'err'))
        lines.push(line('  | || |  / _ \\| || |', 'err'))
        lines.push(line('  | || |_| | | | || |_ ', 'err'))
        lines.push(line('  |__   _| | | |__   _|', 'err'))
        lines.push(line('     | | | |_| | | |  ', 'err'))
        lines.push(line('     |_|  \\___/  |_|  ', 'err'))
        lines.push(line('Strona istnieje. To ty wpisałeś złą komendę :)', 'accent'))
      } else if (c === 'dotnet' || c.startsWith('dotnet ')) {
        lines.push(line('.NET SDK 8.x+ (w głowie autora)', 'ok'))
        lines.push(line('Blazor Hybrid? Server? WASM? Tak.', 'accent'))
      } else if (c === 'git' || c.startsWith('git ')) {
        lines.push(line('a1b2c3d feat: labs terminal smaczki', 'accent'))
        lines.push(line('e4f5g6h fix: jedna linijka, trzy godziny debugowania'))
        lines.push(line('h7i8j9k chore: bump dependencies (znów)'))
      } else if (c === 'npm' || c.startsWith('npm ')) {
        lines.push(line('> build', 'accent'))
        lines.push(line('vite v5.x building for production…'))
        lines.push(line('✓ built in 4.2s (albo dłużej, jeśli Windows Defender patrzy)', 'ok'))
      } else if (c === 'exit' || c === 'quit') {
        lines.push(line('Zamykanie sesji…', 'accent'))
        lines.push(line('…', 'accent'))
        lines.push(line('Nie da się wyjść :). Wpisz ls i zwiedź dalej.', 'ok'))
      } else if (c === 'rm -rf /' || c === 'rm -rf') {
        lines.push(line('Nice try. Ten terminal jest tylko do zabawy.', 'err'))
      } else if (c === 'vim' || c === 'nano' || c === 'emacs') {
        lines.push(line(`${c}: how do I exit?`, 'err'))
        lines.push(line('(Ctrl+C w prawdziwym życiu. Tu po prostu wpisz clear.)'))
      } else if (c === 'cd' || c.startsWith('cd ')) {
        lines.push(line('Jesteś już w ~/labs. Użyj ls.', 'accent'))
      } else if (c === 'cat about.txt') {
        lines.push(line('Full-stack dev'))
      } else if (c === 'konami') {
        lines.push(line('↑↑↓↓←→←→BA — cheat code accepted.', 'ok'))
        lines.push(line('+30 XP w terminalowych easter eggach'))
      } else if (c.startsWith('open ') || c.startsWith('goto ')) {
        const path = args.startsWith('/') ? args : `/${args}`
        lines.push(line(`→ ${path}`, 'ok'))
        navigate(path)
      } else {
        lines.push(line(`nieznana komenda: ${c}`, 'err'))
        lines.push(line('wpisz help — albo spróbuj fortune', 'accent'))
      }

      append(lines)
      setHistory((prev) => (prev[prev.length - 1] === raw ? prev : [...prev, raw].slice(-30)))
      setHistIdx(-1)
      setInput('')
    },
    [append, history, navigate],
  )

  const complete = useCallback(() => {
    const q = input.trim().toLowerCase()
    if (!q) return
    const match = COMMANDS.find((c) => c.startsWith(q))
    if (match) setInput(match)
  }, [input])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Labs</h1>
        <p>Mały playground — easter eggi i eksperymenty.</p>
      </header>
      <div className={`glass ${styles.term}`}>
        <div className={styles.chrome} aria-hidden="true">
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
          <span className={styles.chromeTitle}>lukasz@labs ~ zsh</span>
        </div>
        <div className={styles.out} aria-live="polite">
          {log.map((entry, i) => (
            <div
              key={`${entry.text}-${i}`}
              className={`mono ${styles.line} ${styles[`kind_${entry.kind}`]}`}
            >
              {entry.text}
            </div>
          ))}
        </div>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault()
            run(input)
          }}
        >
          <span className="mono">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setHistIdx(-1)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault()
                complete()
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                if (history.length === 0) return
                const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1)
                setHistIdx(next)
                setInput(history[next] ?? '')
              } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                if (histIdx < 0) return
                const next = histIdx + 1
                if (next >= history.length) {
                  setHistIdx(-1)
                  setInput('')
                } else {
                  setHistIdx(next)
                  setInput(history[next] ?? '')
                }
              }
            }}
            placeholder="wpisz hello albo help…"
            aria-label="Komenda labs"
            className={`mono ${styles.input}`}
            autoComplete="off"
            spellCheck={false}
          />
          <span className={`mono ${styles.cursor}`} aria-hidden="true">
            ▋
          </span>
        </form>
      </div>
    </div>
  )
}
