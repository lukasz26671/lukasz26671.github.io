import type { LocalizedString } from '../i18n/types'

export type LearningSource = {
  name: string
  url: string
  note: LocalizedString
}

export const learningSources: LearningSource[] = [
  {
    name: 'w3schools',
    url: 'https://www.w3schools.com',
    note: {
      pl: 'Repozytorium wiedzy JS, CSS i HTML',
      en: 'JS, CSS, and HTML knowledge base',
    },
  },
  {
    name: 'Khan Academy',
    url: 'https://pl.khanacademy.org',
    note: {
      pl: 'Darmowy kurs ProcessingJS',
      en: 'Free ProcessingJS course',
    },
  },
  {
    name: 'Udacity',
    url: 'https://eu.udacity.com',
    note: {
      pl: 'Kursy JavaScript i nie tylko',
      en: 'JavaScript courses and more',
    },
  },
  {
    name: 'GitHub',
    url: 'https://www.github.com',
    note: {
      pl: 'Hosting kodu i stron (w tym tej)',
      en: 'Code and site hosting (including this one)',
    },
  },
]
