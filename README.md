# Kulineria — Atlas Kuliner Nusantara

[![Astro](https://img.shields.io/badge/Astro-5.18-blueviolet)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org)

> Jelajahi 510+ hidangan tradisional Indonesia dari 6 wilayah Nusantara — lengkap dengan resep, cerita, gizi, peta interaktif, dan kuis seru.

**URL**: [https://kulineria.id](https://kulineria.id)

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | [Astro](https://astro.build) 5 (SSG + Islands Architecture) |
| **UI Interaktif** | [React](https://react.dev) 19 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v4 + CSS Custom Properties |
| **State Management** | [Nano Stores](https://github.com/nanostores/nanostores) + [Zustand](https://github.com/pmndrs/zustand) |
| **Animasi** | [GSAP](https://gsap.com) 3.15 + ScrollTrigger + [Lenis](https://lenis.darkroom.engineering) |
| **Search** | [MiniSearch](https://github.com/lucaong/minisearch) 7 (full-text client-side) |
| **Map** | [MapLibre GL](https://maplibre.org) 5 |
| **Testing** | Vitest + Playwright + Testing Library |
| **Package Manager** | npm |

---

## Prasyarat

- **Node.js** >= 18
- **npm** >= 9

---

## Cara Install & Jalankan

```bash
git clone https://github.com/username/kulineria-astro.git
cd kulineria-astro
npm install
npm run dev
```

Buka `http://localhost:4321` di browser.

---

## Skrip Tersedia

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Jalankan server development (port 4321) |
| `npm run build` | Build static site ke `dist/` |
| `npm run preview` | Preview hasil build lokal |
| `npm run check` | Type-check dengan `astro check` |
| `npm run lint` | Lint dengan ESLint |
| `npm test` | Jalankan unit test (Vitest) |
| `npm run test:e2e` | Jalankan end-to-end test (Playwright) |

---

## Struktur Proyek

```
src/
├── components/
│   ├── astro/               # Komponen Astro (.astro)
│   └── react/               # Komponen React interaktif
│       ├── about/           # Halaman About
│       ├── food-detail/     # Detail hidangan
│       ├── home/            # Halaman utama
│       ├── quiz/            # Kuis kuliner
│       ├── search/          # Pencarian & filter
│       └── shared/          # UI umum (ErrorBoundary, LazyImage, dll)
├── content/                 # Astro Content Collections
│   ├── config.ts            # Schema Zod untuk foods, regions, stories, team
│   ├── foods/               # Konten kaya per hidangan (resep, gizi, cerita)
│   ├── regions/             # Data wilayah
│   ├── stories/             # Cerita (markdown)
│   └── team/                # Data tim
├── data/
│   ├── foods/               # 510+ hidangan per region (JSON)
│   └── regions.json         # 6 wilayah Indonesia
├── layouts/
│   └── BaseLayout.astro     # Layout utama (SEO, font, nav, footer)
├── lib/
│   ├── a11y.ts              # Utility aksesibilitas
│   ├── animations/          # GSAP + Lenis
│   ├── browser.ts           # Deteksi fitur browser
│   ├── data/                # Loader data + quiz generator + search index
│   ├── stores/              # Nano Stores + Zustand
│   └── utils/               # cn(), debounce, throttle, placeholders
├── pages/
│   ├── index.astro          # Halaman utama
│   ├── about.astro          # Tentang Kulineria
│   ├── search.astro         # Pencarian & eksplorasi
│   ├── 404.astro            # Halaman tidak ditemukan
│   ├── quiz/index.astro     # Kuis interaktif
│   ├── food/[id].astro      # Detail hidangan (dynamic route)
│   ├── robots.txt.ts        # robots.txt otomatis
│   └── sitemap.xml.ts       # Sitemap dinamis
├── styles/
│   ├── globals.css          # Tailwind + CSS global + utility classes
│   └── tokens.css           # Design tokens (warna, tipografi, spacing, shadow)
└── types/
    ├── food.ts              # Tipe data makanan
    ├── quiz.ts              # Tipe data kuis
    └── search.ts            # Tipe data pencarian
```

---

## Halaman & Rute

| Rute | Deskripsi |
|---|---|
| `/` | Hero animasi, peta interaktif 6 wilayah, grid makanan dengan filter regional |
| `/search` | Pencarian full-text + autocomplete (Cmd+K), filter rasa/jenis/wilayah, voice search |
| `/quiz` | 3 mode kuis: Tebak Makanan, Tebak Asal, Campuran — lengkap dengan timer, streak, skor |
| `/about` | Manifesto, misi 3 langkah, nilai-nilai, tim (Nara, Chef Budi, Sari) |
| `/food/[id]` | Detail hidangan: hero sinematik, info gizi, bahan, resep langkah, cerita, lokasi |
| `/404` | Halaman kustom dengan maskot Nara, form pencarian, tautan cepat |

---

## Fitur Utama

### 🗺️ Peta Interaktif
6 wilayah Indonesia dapat diklik pada peta untuk memfilter hidangan berdasarkan asal daerah.

### 🔍 Pencarian Cerdas
MiniSearch melakukan full-text search real-time. Filter berdasarkan wilayah, rasa (asin, manis, pedas, dll), dan jenis hidangan (makanan utama, camilan, minuman, dll).

### 🎮 Kuis Kuliner
Tiga mode permainan: tebak nama makanan dari gambar, tebak asal makanan, atau campuran. Dilengkapi sistem skor dengan streak bonus, statistik persistent (localStorage).

### 📖 Detail Hidangan Lengkap
Setiap hidangan menampilkan hero gambar sinematik, grafik gizi, bahan dengan porsi, resep step-by-step, cerita daerah, lokasi rekomendasi, dan hidangan terkait.

### 🎨 Animasi & Interaktivitas
GSAP + Lenis memberikan smooth scroll, scroll-reveal, efek magnetic hover, ripple, 3D tilt, dan transisi halaman yang halus.

### ♿ Aksesibilitas
Skip-to-content, ARIA labels, focus trap pada modal, keyboard navigation, serta dukungan reduced-motion.

### 🎨 Premium Paper Theme
Desain visual eksklusif dengan palet warna hangat 6-warna (Cream, Light Beige, Soft Sand Gold, Caramel, Terracotta, dan Deep Chestnut) yang konsisten di semua preferensi tema untuk tampilan premium seperti majalah kuliner cetak.

### 🤖 SEO
JSON-LD Recipe schema, Open Graph, sitemap XML dinamis, robots.txt — optimal untuk mesin pencari.

---

## Data Konten

### Hidangan (510+)
- **Base data**: `src/data/foods/{region}.json` — 85–89 hidangan per wilayah (id, nama, deskripsi, rasa, jenis, gambar)
- **Konten kaya**: `src/content/foods/{slug}.json` — resep, gizi, cerita, lokasi untuk hidangan unggulan

### Wilayah (6 region)
`Sumatera`, `Jawa`, `Kalimantan`, `Sulawesi`, `Bali & NTT`, `Maluku & Papua`

### Tim
Nara (pemandu), Chef Budi Arsitek Rasa, Sari Penjelajah Peta — disimpan di `src/content/team/`

---

## Animasi

- **GSAP ScrollTrigger**: efek `reveal-up`, `reveal-down`, `reveal-scale`, `stagger`, `parallax`
- **Lenis**: smooth scrolling dengan ScrollTrigger integration
- **MicroInteractions**: `MagneticButton`, `RippleEffect`, `Tilt3D`
- **Fallback safety**: timer 4-5 detik memastikan konten tetap terlihat jika animasi gagal

---

## Lisensi

ISC
