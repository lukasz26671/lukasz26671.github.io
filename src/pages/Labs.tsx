import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import { useLocale } from '../i18n/LocaleContext'
import { localize } from '../i18n/types'
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

function formatUptime(bootMs: number) {
  const s = Math.floor((Date.now() - bootMs) / 1000)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}m ${r}s`
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
  const { locale, t, tList } = useLocale()
  const boot = useRef(Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const localeTag = locale === 'pl' ? 'pl-PL' : 'en-GB'
  const [log, setLog] = useState<LogLine[]>(() => [
    line(t('labs.ready'), 'prompt'),
    line(t('labs.tip'), 'accent'),
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const bootLocale = useRef(locale)

  useEffect(() => {
    if (bootLocale.current === locale) return
    bootLocale.current = locale
    setLog([line(t('labs.ready'), 'prompt'), line(t('labs.tip'), 'accent')])
  }, [locale, t])

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
      const fortunes = tList('labs.fortunes')

      if (c === 'hello' || c === 'hello world') {
        lines.push(line('Hello World!', 'ok'))
        window.alert('Hello World!')
      } else if (c === 'help') {
        lines.push(line(t('labs.helpHeader'), 'accent'))
        tList('labs.helpLines').forEach((l) => lines.push(line(l)))
      } else if (c === 'whoami') {
        lines.push(line('lukasz26671 - full-stack .NET / Blazor / React'))
        lines.push(line(t('labs.whoamiLine2'), 'accent'))
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
        lines.push(line(new Date().toLocaleString(localeTag)))
      } else if (c === 'uptime') {
        lines.push(line(t('labs.uptime', { uptime: formatUptime(boot.current) })))
      } else if (c === 'stack' || c === 'tech') {
        lines.push(line('.NET · C# · Blazor · React · TypeScript · Rust · Java', 'ok'))
        lines.push(line('Three.js · Vite · CSS modules · GitHub Pages'))
      } else if (c === 'projects') {
        projects.slice(0, 6).forEach((p) => {
          lines.push(line(`  ${p.name} - ${localize(locale, p.language)}`, 'accent'))
        })
        lines.push(line(t('labs.projectsMore', { count: Math.max(0, projects.length - 6) })))
      } else if (c === 'fortune') {
        lines.push(line(pick(fortunes), 'ok'))
      } else if (c === 'neofetch') {
        const coffee =
          Math.random() > 0.5 ? t('labs.neofetchCoffeeYes') : t('labs.neofetchCoffeeNo')
        ;`
  lukasz26671@site
  ---------------------
  ${t('labs.neofetchOs')}
  Shell: labs-terminal v0.2
  Stack: .NET · Blazor · React · Rust
  Site: lukasz26671.github.io
  Uptime: ${formatUptime(boot.current)}
  Coffee: ${coffee}
`.trim().split('\n').forEach((l) => lines.push(line(l)))
      } else if (c.startsWith('cowsay')) {
        cowsay(args || 'moo').forEach((l) => lines.push(line(l, 'accent')))
      } else if (c.startsWith('echo ')) {
        lines.push(line(args || ''))
      } else if (c === 'echo') {
        lines.push(line(t('labs.echoHint')))
      } else if (c.startsWith('ping')) {
        const target = args || 'lukasz26671.github.io'
        lines.push(line(`PING ${target}: 42 bytes`, 'accent'))
        lines.push(line(`Reply from ${target}: time=12ms`, 'ok'))
        lines.push(line(`Reply from ${target}: time=9ms`, 'ok'))
        lines.push(line(t('labs.pingStats')))
      } else if (c === 'github') {
        lines.push(line('https://github.com/lukasz26671', 'ok'))
        window.open('https://github.com/lukasz26671', '_blank', 'noopener,noreferrer')
      } else if (c === 'minecraft') {
        lines.push(line(t('labs.minecraft'), 'accent'))
        lines.push(line('-> /minecraft'))
      } else if (c === 'music') {
        lines.push(line(t('labs.music'), 'accent'))
        lines.push(line(t('labs.musicHint')))
      } else if (c.startsWith('sudo')) {
        lines.push(line('lukasz26671 is not in the sudoers file.', 'err'))
        lines.push(line(t('labs.sudoAmbition'), 'accent'))
      } else if (c === 'history') {
        if (history.length === 0) {
          lines.push(line(t('labs.historyEmpty')))
        } else {
          history.forEach((h, i) => lines.push(line(`  ${i + 1}  ${h}`)))
        }
      } else if (c === 'coffee' || c === 'kawa') {
        lines.push(line(t('labs.coffeeDone'), 'ok'))
        lines.push(line(t('labs.coffeeStats')))
      } else if (c === '404') {
        lines.push(line('   _  _    ___  _  _ ', 'err'))
        lines.push(line('  | || |  / _ \\| || |', 'err'))
        lines.push(line('  | || |_| | | | || |_ ', 'err'))
        lines.push(line('  |__   _| | | |__   _|', 'err'))
        lines.push(line('     | | | |_| | | |  ', 'err'))
        lines.push(line('     |_|  \\___/  |_|  ', 'err'))
        lines.push(line(t('labs.notFound'), 'accent'))
      } else if (c === 'dotnet' || c.startsWith('dotnet ')) {
        lines.push(line(t('labs.dotnetHead'), 'ok'))
        lines.push(line(t('labs.dotnetBlazor'), 'accent'))
      } else if (c === 'git' || c.startsWith('git ')) {
        lines.push(line(t('labs.git1'), 'accent'))
        lines.push(line(t('labs.git2')))
        lines.push(line(t('labs.git3')))
      } else if (c === 'npm' || c.startsWith('npm ')) {
        lines.push(line('> build', 'accent'))
        lines.push(line(t('labs.npmBuild')))
        lines.push(line(t('labs.npmDone'), 'ok'))
      } else if (c === 'exit' || c === 'quit') {
        lines.push(line(t('labs.exitClosing'), 'accent'))
        lines.push(line('…', 'accent'))
        lines.push(line(t('labs.exitStuck'), 'ok'))
      } else if (c === 'rm -rf /' || c === 'rm -rf') {
        lines.push(line(t('labs.rmRf'), 'err'))
      } else if (c === 'vim' || c === 'nano' || c === 'emacs') {
        lines.push(line(`${c}: how do I exit?`, 'err'))
        lines.push(line(t('labs.editorExit')))
      } else if (c === 'cd' || c.startsWith('cd ')) {
        lines.push(line(t('labs.cdHint'), 'accent'))
      } else if (c === 'cat about.txt') {
        lines.push(line('Full-stack dev'))
      } else if (c === 'konami') {
        lines.push(line('↑↑↓↓←→←→BA — cheat code accepted.', 'ok'))
        lines.push(line(t('labs.konamiXp')))
      } else if (c.startsWith('open ') || c.startsWith('goto ')) {
        const path = args.startsWith('/') ? args : `/${args}`
        lines.push(line(`→ ${path}`, 'ok'))
        navigate(path)
      } else {
        lines.push(line(t('labs.unknown', { cmd: c }), 'err'))
        lines.push(line(t('labs.unknownHint'), 'accent'))
      }

      append(lines)
      setHistory((prev) => (prev[prev.length - 1] === raw ? prev : [...prev, raw].slice(-30)))
      setHistIdx(-1)
      setInput('')
    },
    [append, history, locale, localeTag, navigate, t, tList],
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
        <h1>{t('labs.title')}</h1>
        <p>{t('labs.lead')}</p>
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
            placeholder={t('labs.placeholder')}
            aria-label={t('labs.inputAria')}
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
