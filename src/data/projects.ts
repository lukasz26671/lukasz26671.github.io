import type { LocalizedString } from '../i18n/types'

export type Project = {
  id: string
  name: string
  description: LocalizedString
  /** Pełniejszy opis (About) */
  longDescription?: LocalizedString
  language: string | LocalizedString
  repoUrl?: string
  liveUrl?: string
  tags?: Array<string | LocalizedString>
  /** Alias komercyjny — bez publicznego repo */
  commercial?: boolean
  /** Link do dłuższej notki (np. About) */
  moreUrl?: string
}

const commercial: LocalizedString = { pl: 'Komercyjne', en: 'Commercial' }

export const commercialProjects: Project[] = [
  {
    id: 'dispatch',
    name: 'Dispatch',
    description: {
      pl: 'Transport, dostawy i potwierdzanie dostaw dla kierowców.',
      en: 'Transport, deliveries, and delivery confirmation for drivers.',
    },
    longDescription: {
      pl: 'System obsługi transportu i dostaw obejmujący zamówienia, przewozy, kierowców, paletowanie oraz proces załadunku. Aplikacja mobilna wspierająca kierowców podczas załadunku, rozładunku i elektronicznego potwierdzania dostaw (proof of delivery) typu Sign On Glass.',
      en: 'Transport and delivery system covering orders, shipments, drivers, palletizing, and loading. A mobile app supporting drivers during loading, unloading, and electronic proof of delivery (Sign On Glass).',
    },
    language: commercial,
    commercial: true,
    moreUrl: '/about#commercial',
    tags: [{ pl: 'logistyka', en: 'logistics' }, 'mobile'],
  },
  {
    id: 'prime',
    name: 'Prime',
    description: {
      pl: 'Kompletacja na hali: SAP, "Dispatch", tablety, skanery i wagi.',
      en: 'Warehouse picking: SAP, “Dispatch”, tablets, scanners, and scales.',
    },
    longDescription: {
      pl: 'Integracja z SAP oraz Dispatch przy kompletowaniu przesyłek. Komunikacja z Kepware Server, aplikacje tabletowe realtime na stanowiskach pakujących, skanery, wagi przemysłowe i połączenie świata aplikacji webowych z fizyczną infrastrukturą.',
      en: 'SAP and Dispatch integration for shipment picking. Kepware Server connectivity, realtime tablet apps at packing stations, scanners, industrial scales, and bridging web apps with physical infrastructure.',
    },
    language: commercial,
    commercial: true,
    moreUrl: '/about#commercial',
    tags: ['SAP', 'real-time'],
  },
  {
    id: 'fusion',
    name: 'Fusion',
    description: {
      pl: 'Deklaracje celne NI-UK z integracją TSS.',
      en: 'NI–UK customs declarations with TSS integration.',
    },
    longDescription: {
      pl: 'System wspierający obsługę deklaracji celnych dla przepływu towarów między Irlandią Północną a Wielką Brytanią, zintegrowany z TSS (Trader Support Service). Automatyzacja procesów wymagających wcześniej ręcznej obsługi i kontroli.',
      en: 'System supporting customs declarations for goods flowing between Northern Ireland and Great Britain, integrated with TSS (Trader Support Service). Automating processes that previously needed manual handling and checks.',
    },
    language: commercial,
    commercial: true,
    moreUrl: '/about#commercial',
    tags: [{ pl: 'integracje', en: 'integrations' }, 'SaaS'],
  },
]

const LINKED_COMMERCIAL = new Set(['dispatch', 'prime'])

export function getCommercialLinkedPair(): [Project, Project] {
  const a = commercialProjects.find((p) => p.id === 'dispatch')
  const b = commercialProjects.find((p) => p.id === 'prime')
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
    description: {
      pl: 'Szybki resolver wyszukiwania — inspirowany Unduck by t3.',
      en: 'Fast search resolver — inspired by Unduck by t3.',
    },
    language: 'C#',
    repoUrl: 'https://github.com/lukasz26671/FastSearchResolver',
    tags: ['C#', '.NET'],
  },
  {
    id: 'web-src-provider',
    name: 'webSrcProvider',
    description: {
      pl: 'Provider źródła playlisty / metadanych audio (TypeScript).',
      en: 'Playlist / audio metadata source provider (TypeScript).',
    },
    language: 'TypeScript',
    repoUrl: 'https://github.com/lukasz26671/webSrcProvider',
    liveUrl: 'https://web-src-provider.vercel.app',
    tags: ['TypeScript', 'Audio'],
  },
  {
    id: 'web-audio-prov',
    name: 'webAudioProv',
    description: {
      pl: 'Web audio provider — streaming i integracja z playerem.',
      en: 'Web audio provider — streaming and player integration.',
    },
    language: 'JavaScript',
    repoUrl: 'https://github.com/lukasz26671/webAudioProv',
    liveUrl: 'https://web-audio-prov.vercel.app',
    tags: ['JavaScript', 'Audio'],
  },
  {
    id: 'r-web-audio-prov',
    name: 'r_webAudioProv',
    description: {
      pl: 'Web source provider przepisany w Rust.',
      en: 'Web source provider rewritten in Rust.',
    },
    language: 'Rust',
    repoUrl: 'https://github.com/lukasz26671/r_webAudioProv',
    tags: ['Rust', 'Audio'],
  },
  {
    id: 'ulid-framework',
    name: 'UlidFramework',
    description: {
      pl: 'Biblioteka ULID w C#.',
      en: 'ULID library in C#.',
    },
    language: 'C#',
    repoUrl: 'https://github.com/lukasz26671/UlidFramework',
    tags: ['C#', 'Library'],
  },
  {
    id: 'st-build',
    name: 'StBuild',
    description: {
      pl: 'Narzędzia / tooling build w C#.',
      en: 'Build tools / tooling in C#.',
    },
    language: 'C#',
    repoUrl: 'https://github.com/lukasz26671/StBuild',
    tags: ['C#', 'Tooling'],
  },
  {
    id: 'web-server-test',
    name: 'WebServerTest',
    description: {
      pl: 'Build your own X — eksperymenty z serwerem HTTP w C#.',
      en: 'Build your own X — HTTP server experiments in C#.',
    },
    language: 'C#',
    repoUrl: 'https://github.com/lukasz26671/WebServerTest',
    tags: ['C#', 'Learning'],
  },
  {
    id: 'dlz-studios',
    name: 'DLZStudiosWebpage',
    description: {
      pl: 'Stronka grupki, współtworzona ze znajomym. Obecnie nie jest nigdzie hostowana.',
      en: 'A group site, co-built with a friend. Currently not hosted anywhere.',
    },
    language: 'JavaScript',
    repoUrl: 'https://github.com/lukasz26671/DLZStudiosWebpage',
    tags: ['JavaScript', 'Web'],
  },
  {
    id: 'hacker-typer-2',
    name: 'HackerTyper2',
    description: {
      pl: 'Symulator hackera — wciskaj klawisze, kod pisze się sam.',
      en: 'Hacker simulator — mash keys and the code writes itself.',
    },
    language: 'JavaScript',
    repoUrl: 'https://github.com/lukasz26671/HackerTyper2',
    liveUrl: '/HackerTyper2/',
    tags: ['JavaScript', 'Fun'],
  },
  {
    id: 'kalkulator',
    name: 'Kalkulator',
    description: {
      pl: 'Kalkulator webowy — jeden z wcześniejszych projektów.',
      en: 'Web calculator — one of the earlier projects.',
    },
    language: 'JavaScript',
    repoUrl: 'https://github.com/lukasz26671/Kalkulator',
    liveUrl: '/Kalkulator/',
    tags: ['JavaScript'],
  },
  {
    id: 'utils-mod',
    name: 'Lukasz26671Utils',
    description: {
      pl: 'Minecraft utils mod (1.7.10).',
      en: 'Minecraft utils mod (1.7.10).',
    },
    language: 'Java',
    repoUrl: 'https://github.com/lukasz26671/Lukasz26671Utils',
    liveUrl: 'https://github.com/lukasz26671/Lukasz26671Utils/releases',
    tags: ['Java', 'Minecraft'],
  },
  {
    id: 'wifi-extractor',
    name: 'rust_wifi_password_extractor',
    description: {
      pl: 'CLI do odczytu zapisanych haseł Wi‑Fi (Rust).',
      en: 'CLI to read saved Wi‑Fi passwords (Rust).',
    },
    language: 'Rust',
    repoUrl: 'https://github.com/lukasz26671/rust_wifi_password_extractor',
    tags: ['Rust', 'CLI'],
  },
  {
    id: 'this-site',
    name: 'lukasz26671.github.io',
    description: {
      pl: 'Ta strona — portfolio, landing 3D i odtwarzacz audio.',
      en: 'This site — portfolio, 3D landing, and audio player.',
    },
    language: 'TypeScript',
    repoUrl: 'https://github.com/lukasz26671/lukasz26671.github.io',
    liveUrl: '/',
    tags: ['React', 'Three.js'],
  },
]
