export type Project = {
  id: string
  name: string
  description: string
  language: string
  repoUrl: string
  liveUrl?: string
  tags?: string[]
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
