import type { LocalizedString } from '../i18n/types'

export type TimelineItem = {
  year: LocalizedString
  title: LocalizedString
  body: LocalizedString
}

export const timeline: TimelineItem[] = [
  {
    year: { pl: '2024–obecnie', en: '2024–present' },
    title: { pl: 'Studia — WSB-NLU', en: 'Studies — WSB-NLU' },
    body: {
      pl: 'Student Wyższej Szkoły Biznesu — National Louis University, kierunek Programowanie Aplikacji Biznesowych. Rozwijanie wiedzy z zakresu tworzenia oprogramowania, architektury systemów i zastosowań biznesowych technologii.',
      en: 'Student at Wyższa Szkoła Biznesu — National Louis University, Business Application Programming. Building knowledge in software development, system architecture, and business uses of technology.',
    },
  },
  {
    year: { pl: '2023–obecnie', en: '2023–present' },
    title: { pl: 'Fullstack .NET — Freeway IT', en: 'Fullstack .NET — Freeway IT' },
    body: {
      pl: 'Praca przy aplikacjach biznesowych end-to-end. Głównie C#, .NET i Blazor, czasem starsze rozwiązania MVC. Rozwiązania dla firm.',
      en: 'End-to-end business applications. Mostly C#, .NET, and Blazor, sometimes older MVC. Solutions for companies.',
    },
  },
  {
    year: { pl: '2018–2022', en: '2018–2022' },
    title: {
      pl: 'Własne projekty — Node.js, audio, Unity, C#',
      en: 'Personal projects — Node.js, audio, Unity, C#',
    },
    body: {
      pl: 'Rozwój własnych projektów: backendy pod system audio tej strony, eksperymenty z różnymi technologiami oraz game-dev w Unity. Dużo nauki poprzez budowanie rzeczy od podstaw.',
      en: 'Personal projects: backends for this site’s audio system, experiments with various tech, and Unity game-dev. Lots of learning by building from scratch.',
    },
  },
  {
    year: { pl: '2014-2018', en: '2014–2018' },
    title: {
      pl: 'Web i początki własnego portfolio',
      en: 'Web and early portfolio',
    },
    body: {
      pl: 'HTML, CSS, JavaScript i pierwsze większe projekty webowe. W tym okresie powstały m.in. HackerTyper, Kalkulator oraz pierwsze wersje lukasz26671.github.io.',
      en: 'HTML, CSS, JavaScript, and the first larger web projects. This period includes HackerTyper, Kalkulator, and early versions of lukasz26671.github.io.',
    },
  },
  {
    year: { pl: '2014', en: '2014' },
    title: {
      pl: 'Pierwsze linijki kodu — Java',
      en: 'First lines of code — Java',
    },
    body: {
      pl: 'Początek przygody z programowaniem. Nauka podstaw, obiektowości i pierwsze eksperymenty z kodem. Od tego momentu programowanie stało się stałym elementem codzienności.',
      en: 'Start of the programming journey. Learning basics, OOP, and first code experiments. From then on, programming became part of everyday life.',
    },
  },
]
