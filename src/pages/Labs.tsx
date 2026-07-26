import { useState } from 'react'
import styles from './Labs.module.css'

export function LabsPage() {
  const [log, setLog] = useState<string[]>(['> labs ready'])
  const [input, setInput] = useState('')

  const run = (cmd: string) => {
    const c = cmd.trim().toLowerCase()
    if (!c) return
    const lines = [`> ${cmd}`]
    if (c === 'hello' || c === 'hello world') {
      lines.push('Hello World!')
      window.alert('Hello World!')
    } else if (c === 'help') {
      lines.push('komendy: hello, help, clear, whoami')
    } else if (c === 'whoami') {
      lines.push('lukasz26671 — full-stack .NET / Blazor / React')
    } else if (c === 'clear') {
      setLog([])
      setInput('')
      return
    } else {
      lines.push(`nieznana komenda: ${c}`)
    }
    setLog((prev) => [...prev, ...lines].slice(-40))
    setInput('')
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Labs</h1>
        <p>Mały playground — easter eggi i eksperymenty.</p>
      </header>
      <div className={`glass ${styles.term}`}>
        <div className={styles.out} aria-live="polite">
          {log.map((line, i) => (
            <div key={`${line}-${i}`} className="mono">
              {line}
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="wpisz hello…"
            aria-label="Komenda labs"
            className="mono"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  )
}
