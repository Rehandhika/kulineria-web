# Kulineria

Website eksplorasi kuliner nusantara. Dibangun pakai Astro + React, Tailwind buat styling, GSAP & Lenis buat animasi, dan Swup buat transisi halaman.

## Stack

- **Astro 5** — static site generator
- **React 19** — komponen interaktif (cuma di-mount kalau perlu)
- **Tailwind CSS 4** — utility-first styling
- **GSAP + Lenis** — animasi & smooth scroll
- **Swup** — transisi halaman ala SPA
- **MiniSearch** — pencarian client-side
- **Zustand & Nanostores** — state management
- **TypeScript** — strict mode

## Prasyarat

- **Node.js 22** (lihat `.nvmrc`)
- **npm 10+**

Disarankan pakai `nvm`:

```bash
nvm use
```

## Install & Jalankan

Clone repo, lalu install dependencies:

```bash
npm install
```

Jalanin dev server:

```bash
npm run dev
```

Buka `http://localhost:4321`.

Build produksi:

```bash
npm run build
```

Hasil build ada di folder `dist/`. Buat preview sebelum deploy:

```bash
npm run preview
```

Cek TypeScript & Astro:

```bash
npm run typecheck
```

## Struktur

```
src/
├── components/
│   ├── astro/      # Komponen .astro (statis + server)
│   └── react/      # Komponen interaktif
├── content/        # Content collections (team)
├── data/           # Data JSON (foods, regions)
├── layouts/        # Layout wrapper
├── lib/            # Helpers, animasi, store, loader data
├── pages/          # Routing
├── styles/         # Global CSS & tokens
└── types/          # Type definitions
```

## Halaman

| Route                | Keterangan                            |
| -------------------- | ------------------------------------- |
| `/`                  | Beranda                               |
| `/jelajahi`          | Peta & eksplorasi per daerah          |
| `/hidangan/[id]`     | Detail makanan                        |
| `/kuis`              | Kuis interaktif                       |
| `/tentang`           | Tim & cerita                          |

## Konten

- **Makanan** — lihat `src/data/foods/` (6 file JSON per pulau) dan `src/content/foods/` (67 file JSON per hidangan)
- **Daerah** — `src/data/regions.json`
- **Tim** — `src/content/team/*.json`

Tambah makanan baru: copy salah satu file di `src/content/foods/`, sesuaikan isinya, lalu tambahkan ID-nya ke `src/data/foods/[region].json` kalau mau muncul di eksplorasi.

## Deploy

Repo ini sudah dikonfigurasi buat **Netlify** (lihat `netlify.toml`). Tinggal connect repo, sisanya otomatis.

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 22

## Lisensi

MIT
