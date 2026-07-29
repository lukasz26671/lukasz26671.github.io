import type { Messages } from './messages/types'
import { en } from './messages/en'
import { pl } from './messages/pl'
import type { Locale } from './types'

export const catalogs: Record<Locale, Messages> = { pl, en }

export type MessagePath = string

type Params = Record<string, string | number>

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split('.')
  let cur: unknown = obj
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[part]
  }
  return cur
}

export function translate(
  locale: Locale,
  path: string,
  params?: Params,
): string {
  const raw = getByPath(catalogs[locale], path)
  const fallback = getByPath(catalogs.pl, path)
  let text =
    typeof raw === 'string'
      ? raw
      : typeof fallback === 'string'
        ? fallback
        : path

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      text = text.replaceAll(`{${key}}`, String(value))
    }
  }
  return text
}

export function translateList(locale: Locale, path: string): string[] {
  const raw = getByPath(catalogs[locale], path)
  if (Array.isArray(raw) && raw.every((x) => typeof x === 'string')) {
    return raw as string[]
  }
  const fallback = getByPath(catalogs.pl, path)
  if (Array.isArray(fallback) && fallback.every((x) => typeof x === 'string')) {
    return fallback as string[]
  }
  return []
}
