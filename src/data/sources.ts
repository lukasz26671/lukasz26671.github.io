export type LearningSource = {
  name: string
  url: string
  note: string
}

export const learningSources: LearningSource[] = [
  {
    name: 'w3schools',
    url: 'https://www.w3schools.com',
    note: 'Repozytorium wiedzy JS, CSS i HTML',
  },
  {
    name: 'Khan Academy',
    url: 'https://pl.khanacademy.org',
    note: 'Darmowy kurs ProcessingJS',
  },
  {
    name: 'Udacity',
    url: 'https://eu.udacity.com',
    note: 'Kursy JavaScript i nie tylko',
  },
  {
    name: 'GitHub',
    url: 'https://www.github.com',
    note: 'Hosting kodu i stron (w tym tej)',
  },
]
