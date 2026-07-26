export type Project = {
  id: string
  name: string
  description: string
  /** Pełniejszy opis (About) */
  longDescription?: string
  language: string
  repoUrl?: string
  liveUrl?: string
  tags?: string[]
  /** Alias komercyjny — bez publicznego repo */
  commercial?: boolean
  /** Link do dłuższej notki (np. About) */
  moreUrl?: string
}

export const commercialProjects: Project[] = [
  {
    id: 'sign-on-glass',
    name: 'SignOnGlass',
    description: 'Transport, dostawy i potwierdzanie dostaw dla kierowców.',
    longDescription:
      'System obsługi transportu i dostaw obejmujący zamówienia, przewozy, kierowców, paletowanie oraz proces załadunku. Aplikacja mobilna wspierająca kierowców podczas załadunku, rozładunku i elektronicznego potwierdzania dostaw (proof of delivery).',
    language: 'Komercyjne',
    commercial: true,
    moreUrl: '/about#commercial',
    tags: ['logistyka', 'mobile'],
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'Kompletacja na hali: SAP, SignOnGlass, tablety, skanery i wagi.',
    longDescription:
      'Integracja z SAP oraz SignOnGlass przy kompletowaniu przesyłek. Komunikacja z Kepware Server, aplikacje tabletowe realtime na stanowiskach pakujących, skanery, wagi przemysłowe i połączenie świata aplikacji webowych z fizyczną infrastrukturą.',
    language: 'Komercyjne',
    commercial: true,
    moreUrl: '/about#commercial',
    tags: ['SAP', 'real-time', 'industrial'],
  },
  {
    id: 'flow',
    name: 'Flow',
    description: 'Deklaracje celne NI↔UK z integracją TSS.',
    longDescription:
      'System wspierający obsługę deklaracji celnych dla przepływu towarów między Irlandią Północną a Wielką Brytanią, zintegrowany z TSS (Trader Support Service). Automatyzacja procesów wymagających wcześniej ręcznej obsługi i kontroli.',
    language: 'Komercyjne',
    commercial: true,
    moreUrl: '/about#commercial',
    tags: ['integracje', 'SaaS'],
  },
]

const LINKED_COMMERCIAL = new Set(['sign-on-glass', 'sentinel'])

export function getCommercialLinkedPair(): [Project, Project] {
  const a = commercialProjects.find((p) => p.id === 'sign-on-glass')
  const b = commercialProjects.find((p) => p.id === 'sentinel')
  if (!a || !b) throw new Error('Missing linked commercial projects')
  return [a, b]
}

export function getCommercialStandalone(): Project[] {
  return commercialProjects.filter((p) => !LINKED_COMMERCIAL.has(p.id))
}

export const projects: Project[] = [
  {
    id: 'fast-search-resolver',
    name: 'FastSearchResolver',
    description: 'Szybki resolver wyszukiwania — inspirowany Unduck by t3.',
    language: 'C#',
    repoUrl: 'https://github.com/lukasz26671/FastSearchResolver',
    tags: ['C#', '.NET'],
  },
  {
    id: 'web-src-provider',
    name: 'webSrcProvider',
    description: 'Provider źródła playlisty / metadanych audio (TypeScript).',
    language: 'TypeScript',
    repoUrl: 'https://github.com/lukasz26671/webSrcProvider',
    liveUrl: 'https://web-src-provider.vercel.app',
    tags: ['TypeScript', 'Audio'],
  },
  {
    id: 'web-audio-prov',
    name: 'webAudioProv',
    description: 'Web audio provider — streaming i integracja z playerem.',
    language: 'JavaScript',
    repoUrl: 'https://github.com/lukasz26671/webAudioProv',
    liveUrl: 'https://web-audio-prov.vercel.app',
    tags: ['JavaScript', 'Audio'],
  },
  {
    id: 'r-web-audio-prov',
    name: 'r_webAudioProv',
    description: 'Web source provider przepisany w Rust.',
    language: 'Rust',
    repoUrl: 'https://github.com/lukasz26671/r_webAudioProv',
    tags: ['Rust', 'Audio'],
  },
  {
    id: 'ulid-framework',
    name: 'UlidFramework',
    description: 'Biblioteka ULID w C#.',
    language: 'C#',
    repoUrl: 'https://github.com/lukasz26671/UlidFramework',
    tags: ['C#', 'Library'],
  },
  {
    id: 'st-build',
    name: 'StBuild',
    description: 'Narzędzia / tooling build w C#.',
    language: 'C#',
    repoUrl: 'https://github.com/lukasz26671/StBuild',
    tags: ['C#', 'Tooling'],
  },
  {
    id: 'web-server-test',
    name: 'WebServerTest',
    description: 'Build your own X — eksperymenty z serwerem HTTP w C#.',
    language: 'C#',
    repoUrl: 'https://github.com/lukasz26671/WebServerTest',
    tags: ['C#', 'Learning'],
  },
  {
    id: 'dlz-studios',
    name: 'DLZStudiosWebpage',
    description: 'Stronka grupki, współtworzona ze znajomym. Obecnie nie jest nigdzie hostowana.',
    language: 'JavaScript',
    repoUrl: 'https://github.com/lukasz26671/DLZStudiosWebpage',
    tags: ['JavaScript', 'Web'],
  },
  {
    id: 'hacker-typer-2',
    name: 'HackerTyper2',
    description: 'Symulator hackera — wciskaj klawisze, kod pisze się sam.',
    language: 'JavaScript',
    repoUrl: 'https://github.com/lukasz26671/HackerTyper2',
    liveUrl: '/HackerTyper2/',
    tags: ['JavaScript', 'Fun'],
  },
  {
    id: 'kalkulator',
    name: 'Kalkulator',
    description: 'Kalkulator webowy — jeden z wcześniejszych projektów.',
    language: 'JavaScript',
    repoUrl: 'https://github.com/lukasz26671/Kalkulator',
    liveUrl: '/Kalkulator/',
    tags: ['JavaScript'],
  },
  {
    id: 'utils-mod',
    name: 'Lukasz26671Utils',
    description: 'Minecraft utils mod (1.7.10).',
    language: 'Java',
    repoUrl: 'https://github.com/lukasz26671/Lukasz26671Utils',
    liveUrl: 'https://github.com/lukasz26671/Lukasz26671Utils/releases',
    tags: ['Java', 'Minecraft'],
  },
  {
    id: 'wifi-extractor',
    name: 'rust_wifi_password_extractor',
    description: 'CLI do odczytu zapisanych haseł Wi‑Fi (Rust).',
    language: 'Rust',
    repoUrl: 'https://github.com/lukasz26671/rust_wifi_password_extractor',
    tags: ['Rust', 'CLI'],
  },
  {
    id: 'this-site',
    name: 'lukasz26671.github.io',
    description: 'Ta strona — portfolio, landing 3D i odtwarzacz audio.',
    language: 'TypeScript',
    repoUrl: 'https://github.com/lukasz26671/lukasz26671.github.io',
    liveUrl: '/',
    tags: ['React', 'Three.js'],
  },
]
