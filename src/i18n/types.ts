export type Locale = 'pl' | 'en'

export type LocalizedString = { pl: string; en: string }

export function localize(locale: Locale, value: string | LocalizedString): string {
  if (typeof value === 'string') return value
  return value[locale]
}

export function localizeList(
  locale: Locale,
  items: Array<string | LocalizedString> | undefined,
): string[] {
  if (!items) return []
  return items.map((item) => localize(locale, item))
}

export function pluralizeYears(locale: Locale, n: number): string {
  if (locale === 'en') return n === 1 ? 'year' : 'years'

  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'rok'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'lata'
  return 'lat'
}
