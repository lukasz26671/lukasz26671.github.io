import {
  getCommercialLinkedPair,
  getCommercialStandalone,
} from '../data/projects'
import styles from './About.module.css'

export function AboutPage() {
  const age = getAge(new Date(2004, 2, 9))
  const [signOnGlass, sentinel] = getCommercialLinkedPair()
  const commercialSolo = getCommercialStandalone()

  return (
    <div className="page">
      <header className="page-header">
        <h1>O mnie</h1>
        <p>
          Jestem Łukasz, mam {age} {pluralizeLat(age)} i od lat buduję rzeczy, które łączą kod z
          realnym światem. Od własnych eksperymentów po systemy działające w środowiskach
          komercyjnych.
        </p>
      </header>

      <div className={`glass ${styles.stack}`}>
        <section>
          <h2 className={styles.sectionTitle}>Obecnie</h2>
          <p className={styles.body}>
            Pracuję jako fullstack developer w Freeway IT. Na co dzień tworzę aplikacje biznesowe
            wykorzystując głównie{' '}
            <span className={styles.keep}>
              <strong>C#</strong>, <strong>.NET</strong> oraz <strong>Blazor</strong>
            </span>
            . Nie ograniczam się wyłącznie do warstwy aplikacyjnej — często pracuję na styku
            software'u, integracji oraz systemów przemysłowych, łącząc aplikacje z realnymi
            procesami i infrastrukturą.
          </p>
          <p className={styles.bodySpaced}>
            Od 2024 roku studiuję na Wyższej Szkole Biznesu — National Louis University, na
            kierunku Programowanie Aplikacji Biznesowych.
          </p>
          <p className={styles.bodySpaced}>
            Lubię budować rozwiązania od podstaw: od projektu architektury, przez backend i
            frontend, aż po integracje z zewnętrznymi systemami, bazami danych oraz infrastrukturą
            działającą w realnych procesach biznesowych.
          </p>
        </section>

        <section id="commercial" className={styles.projectsSection}>
          <h2 className={styles.sectionTitle}>
            Projekty komercyjne — software w realnym świecie
          </h2>

          <p className={styles.projectsIntro}>
            Kilka przykładów systemów, przy których pracowałem — od podstaw. Nazwy poniżej są
            zastępcze.
          </p>

          <div className={styles.linkedCluster}>
            <ul className={styles.projectList}>
              {[signOnGlass, sentinel].map((p) => (
                <li key={p.id} className={styles.projectItem}>
                  <div className={styles.projectHead}>
                    <span className={styles.projectName}>{p.name}</span>
                    {p.tags && (
                      <span className={styles.projectTag}>{p.tags.join(' · ')}</span>
                    )}
                  </div>
                  <p>{p.longDescription ?? p.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <ul className={styles.projectList}>
            {commercialSolo.map((p) => (
              <li key={p.id} className={styles.projectItem}>
                <div className={styles.projectHead}>
                  <span className={styles.projectName}>{p.name}</span>
                  {p.tags && (
                    <span className={styles.projectTag}>{p.tags.join(' · ')}</span>
                  )}
                </div>
                <p>{p.longDescription ?? p.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Początki</h2>

          <p className={styles.body}>
            Programowanie zacząłem od Javy (~2014), później rozwijałem się w kierunku webu,
            JavaScriptu, Node.js, Unity oraz C#. Przez lata powstało wiele własnych projektów —
            od małych narzędzi po rzeczy związane z webem, audio i automatyką.
          </p>

          <p className={styles.bodySpaced}>
            Część projektów zniknęła razem ze starymi hostingami, część została zamknięta, ale
            właśnie dzięki takim eksperymentom nauczyłem się najwięcej.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Po godzinach</h2>

          <p className={styles.body}>
            Po godzinach najczęściej trafiam w obszary, które ciężko zmieścić w jednym stacku:
            lokalne modele AI, automatyzacja, infrastruktura, Docker, eksperymenty ze sprzętem oraz
            własne narzędzia usprawniające codzienną pracę.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Ta strona</h2>

          <p className={styles.body}>
            Lukasz26671.github.io działa od 2016 roku. Projekt ewoluował razem ze mną — od prostych
            stron po obecny landing wykorzystujący Three.js z klimatem network / plexus.
          </p>

          <p className={styles.bodySpaced}>
            Nadal traktuję ją bardziej jako cyfrowe laboratorium niż zwykłe portfolio. Miejsce na
            eksperymenty, testowanie pomysłów i rzeczy, których niekoniecznie robi się w pracy.
          </p>
        </section>
      </div>
    </div>
  )
}

function getAge(birth: Date, now = new Date()): number {
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()

  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age -= 1
  }

  return age
}

function pluralizeLat(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100

  if (mod10 === 1 && mod100 !== 11) return 'rok'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'lata'

  return 'lat'
}