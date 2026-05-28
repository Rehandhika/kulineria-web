# Homepage Redesign — Implementation Plan

## Ringkasan

5 perubahan besar:
1. **Section transitions** — gradient mask + border accent antara Hero→Map→Foods
2. **GSAP ScrollTrigger** — scroll-triggered reveals untuk map section dan foods header
3. **Copy refinement** — Hero subtitle + Map section subtitle lebih evocative
4. **Hero scroll indicator** — animated chevron di bottom hero
5. **Copy naturalization** — Semua teks homepage dibuat lebih natural (lihat di bawah)

---

## File 1: NEW — `src/styles/section-transitions.css`

```css
/* ─── SECTION TRANSITIONS ────────────────────── */

.map-section,
.featured {
  position: relative;
}

/* Border accent bar di top tiap section */
.map-section::after,
.featured::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 2px;
  background: var(--c-accent);
  opacity: 0.15;
  border-radius: 1px;
  z-index: 3;
  pointer-events: none;
}

/* Gradient mask: Hero (dark mocha) → Map section (cream) */
.map-section::before {
  content: '';
  position: absolute;
  top: -60px;
  left: 0;
  width: 100%;
  height: 60px;
  background: linear-gradient(to bottom, var(--c-brand-caramel-dark) 0%, transparent 100%);
  pointer-events: none;
  z-index: 2;
}

@media (prefers-color-scheme: dark) {
  .map-section::before {
    background: linear-gradient(to bottom, #2A1C10 0%, transparent 100%);
  }
  .map-section::after,
  .featured::after {
    opacity: 0.08;
  }
}
```

---

## File 2: MODIFY — `src/pages/index.astro`

### Frontmatter (no changes)

### Template — perubahan:

```astro
<BaseLayout title="Home" description="Discover the rich flavors of Indonesian cuisine through an interactive exploration of regional specialties">
  <HeroSection />

  <!-- MAP SECTION -->
  <section class="map-section section-py" id="map-section">
    <div class="container map-section-container">
      <SectionHeader
        title="Jelajahi Nusantara"
        subtitle="Pilih pulau untuk menemukan cerita rasa dari setiap daerah"
      />
      <InteractiveMap client:visible />
      <RegionBanner client:idle />
    </div>
  </section>

  <!-- FEATURED FOODS -->
  <FeaturedFoodsGrid client:visible />
  <Footer />
</BaseLayout>
```

**Changes:**
- Line 19: `subtitle="Pilih pulau untuk menemukan cerita rasa dari setiap daerah"`
- Line 15: tambah `class="section-py"` ke `<section>`

### Style tag — perubahan:

Remove lines 36-57 (old custom padding). Replace with:

```css
<style is:global>
  @import '../styles/section-transitions.css';

  .map-section {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 8L72 40L40 72L8 40Z' fill='none' stroke='%23C49A6E' stroke-width='0.5' opacity='0.08'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 80px 80px;
  }

  @media (max-width: 639px) {
    .map-section {
      min-height: auto;
    }
  }

  /* ... sisanya sama (map-section-container, interactive-map, map-container, map-ocean-bg, dll) ... */
</style>
```

Keep all existing map-related CSS (`.map-container`, `.map-ocean-bg`, `.map-region-path`, `.map-region-img`, `.map-tooltip`).

### New `<script>` tag — tambahkan di akhir sebelum `</BaseLayout>`:

```astro
<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initScrollReveals() {
  // Map section header
  const mapHeader = document.querySelector('.map-section .duo-section-header');
  if (mapHeader && !mapHeader.dataset.revealed) {
    mapHeader.dataset.revealed = 'true';
    gsap.fromTo(mapHeader,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: mapHeader, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }

  // Map container
  const mapEl = document.querySelector('.interactive-map');
  if (mapEl && !mapEl.dataset.revealed) {
    mapEl.dataset.revealed = 'true';
    gsap.fromTo(mapEl,
      { opacity: 0, y: 60, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: mapEl, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  // Featured foods header
  const featuredHeader = document.querySelector('#featured .featured-header');
  if (featuredHeader && !featuredHeader.dataset.revealed) {
    featuredHeader.dataset.revealed = 'true';
    gsap.fromTo(featuredHeader,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: featuredHeader, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }
}

function triggerReveals() { setTimeout(initScrollReveals, 80); }

document.addEventListener('DOMContentLoaded', triggerReveals);
document.addEventListener('swup:page:view', triggerReveals);
window.__pageAnimate = window.__pageAnimate || [];
window.__pageAnimate.push(triggerReveals);
setTimeout(initScrollReveals, 4000);
</script>
```

---

## File 3: MODIFY — `src/components/astro/home/HeroSection.astro`

### Subtitle copy (line 34-37):

Change from:
```astro
<p class="hero-subtitle">
  Temukan <strong class="hero-strong">{foods.length}+</strong> hidangan tradisional dari
  <strong class="hero-strong">{regionCount}</strong> wilayah Indonesia
</p>
```

To:
```astro
<p class="hero-subtitle">
  Jelajahi <strong class="hero-strong">{foods.length}+</strong> hidangan dari
  <strong class="hero-strong">{regionCount}</strong> wilayah.
  <br />
  Satu Nusantara, tak terbatas rasa.
</p>
```

### Scroll indicator HTML (tambah sebelum `</section>` di line 43):

```astro
<div class="hero-scroll-indicator" aria-hidden="true">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
</div>
```

### Scroll indicator CSS (tambah di dalam `<style>` setelah `.hero-cta` styles):

```css
.hero-scroll-indicator {
  position: absolute;
  bottom: var(--sp-6);
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 248, 240, 0.25);
  animation: heroScrollBounce 2.4s ease-in-out infinite;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  animation: heroScrollBounce 2.4s ease-in-out infinite, heroFadeIn 1s ease 2s forwards;
}

.hero-scroll-indicator svg {
  display: block;
}

@keyframes heroScrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}

@keyframes heroFadeIn {
  to { opacity: 1; }
}
```

Wait — an element can't have two `animation` properties on the same selector (second overrides first). Use this instead:

```css
.hero-scroll-indicator {
  position: absolute;
  bottom: var(--sp-6);
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 248, 240, 0.25);
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  animation: heroFadeIn 1s ease 2s forwards;
}

.hero-scroll-indicator svg {
  display: block;
  animation: heroScrollBounce 2.4s ease-in-out infinite;
}
```

---

## File 4: MODIFY — `src/components/react/home/FeaturedFoodsGrid.css`

Add `position: relative` to `.featured`:

Find the existing `.featured` rule and add `position: relative;`:

```css
.featured {
  position: relative;
  padding-top: var(--sp-20);
  padding-bottom: var(--sp-20);
}
```

---

## File 5: MODIFY — `src/styles/globals.css` (Optional)

No changes needed — `.section-py` already exists and `gsap/ScrollTrigger` module is part of the gsap package.

---

## Urutan Eksekusi

1. Buat `src/styles/section-transitions.css`
2. Edit `src/pages/index.astro` — template + style + script
3. Edit `src/components/astro/home/HeroSection.astro`
4. Edit `src/components/react/home/FeaturedFoodsGrid.css`
5. Build verify: `npx astro build`

---

## Animasi — Reactive Scroll Narrative

### Filosofi
- Semua animasi via `transform`+`opacity` (GPU composited)
- Satu easing utama: `power3.out` untuk ScrollTrigger, `back.out(1.7)` untuk tombol
- Responsive: stagger lebih cepat di mobile, parallax dimatikan di <640px
- `prefers-reduced-motion: reduce` → semua set ke end state, ScrollTrigger di-disable

### 1. HeroSection.astro — script changes

**Additions:**
- `const reduced = window.matchMedia('...reduce').matches` — early return dengan `gsap.set()`
- `const isMobile = window.innerWidth < 640` — untuk stagger
- `stagger: isMobile ? 0.06 : 0.1` pada word animation

**Script after changes:**
```js
import { gsap } from 'gsap';

function initHero() {
  const hero = document.getElementById('hero-section');
  if (!hero || hero.dataset.animated) return;
  hero.dataset.animated = 'true';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 640;

  if (reduced) {
    gsap.set(hero.querySelector('.hero-bg'), { scale: 1, opacity: 1 });
    gsap.set(hero.querySelector('.hero-noise-svg'), { opacity: 0.8 });
    gsap.set(hero.querySelector('.hero-label'), { y: 0, opacity: 1 });
    gsap.set(hero.querySelectorAll('.hero-word'), { y: 0, opacity: 1, filter: 'blur(0px)' });
    gsap.set(hero.querySelector('.hero-subtitle'), { y: 0, opacity: 1 });
    gsap.set(hero.querySelector('.hero-cta'), { y: 0, opacity: 1, scale: 1 });
    return;
  }

  const label = hero.querySelector('.hero-label');
  const words = hero.querySelectorAll('.hero-word');
  const subtitle = hero.querySelector('.hero-subtitle');
  const cta = hero.querySelector('.hero-cta');
  const bg = hero.querySelector('.hero-bg');
  const noise = hero.querySelector('.hero-noise-svg');

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.fromTo(bg, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }, 0)
    .fromTo(noise, { opacity: 0 }, { opacity: 0.8, duration: 2.5 }, 0)
    .fromTo(label, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.15)
    .fromTo(words, { y: 80, opacity: 0, filter: 'blur(15px)' }, {
      y: 0, opacity: 1, filter: 'blur(0px)', stagger: isMobile ? 0.06 : 0.1, duration: 1.3,
    }, 0.2)
    .fromTo(subtitle, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.45')
    .fromTo(cta, { y: 24, opacity: 0, scale: 0.92 }, {
      y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)',
    }, '-=0.35');
}
// ... rest of 3-layer defense unchanged
```

### 2. index.astro — ScrollTrigger script changes

**Additions to existing script:**
- Hero parallax (ScrollTrigger scrub, desktop only)
- Map ocean bg reveal (staggered with header)
- Responsive trigger start positions
- Reduced motion handler

**Full script after changes:**
```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initScrollReveals() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 640;

  if (reduced) {
    gsap.set('.map-section .duo-section-header', { opacity: 1, y: 0 });
    gsap.set('.interactive-map', { opacity: 1, y: 0, scale: 1 });
    gsap.set('#featured .featured-header', { opacity: 1, y: 0 });
    return;
  }

  // ── HERO PARALLAX (desktop only) ──
  const hero = document.getElementById('hero-section');
  if (hero && !isMobile) {
    const heroBg = hero.querySelector('.hero-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        y: '15%',
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    gsap.to('.hero-inner', {
      opacity: 0.7,
      y: -20,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }

  // ── MAP SECTION STAGGERED REVEAL ──
  const mapHeader = document.querySelector('.map-section .duo-section-header');
  const mapEl = document.querySelector('.interactive-map');
  const oceanBg = document.querySelector('.map-ocean-bg');
  const mapTrigger = isMobile ? 'top 90%' : 'top 80%';

  if (mapHeader && !mapHeader.dataset.revealed) {
    mapHeader.dataset.revealed = 'true';
    gsap.fromTo(mapHeader,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: mapHeader, start: mapTrigger, toggleActions: 'play none none none' }
      }
    );
  }

  if (oceanBg && !oceanBg.dataset.revealed) {
    oceanBg.dataset.revealed = 'true';
    gsap.fromTo(oceanBg,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: oceanBg, start: mapTrigger, toggleActions: 'play none none none' }
      }
    );
  }

  if (mapEl && !mapEl.dataset.revealed) {
    mapEl.dataset.revealed = 'true';
    gsap.fromTo(mapEl,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: mapEl, start: isMobile ? 'top 85%' : 'top 75%', toggleActions: 'play none none none' }
      }
    );
  }

  // ── FEATURED FOODS HEADER REVEAL ──
  const featuredHeader = document.querySelector('#featured .featured-header');
  if (featuredHeader && !featuredHeader.dataset.revealed) {
    featuredHeader.dataset.revealed = 'true';
    gsap.fromTo(featuredHeader,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: featuredHeader, start: isMobile ? 'top 90%' : 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }

  ScrollTrigger.refresh();
}

function triggerReveals() { setTimeout(initScrollReveals, 80); }

document.addEventListener('DOMContentLoaded', triggerReveals);
document.addEventListener('swup:page:view', triggerReveals);
window.__pageAnimate = window.__pageAnimate || [];
window.__pageAnimate.push(triggerReveals);
setTimeout(initScrollReveals, 4000);
```

**Also remove** the `position: relative` from `.map-section` in the style tag (already done previously).

**Add** `will-change: transform, opacity` to `.map-ocean-bg`:
```css
.map-ocean-bg {
  will-change: opacity;
  /* ... rest ... */
}
```

### 3. RegionBanner.tsx — staggered inner entrance

Replace the `useEffect` with staggered timeline:

```tsx
useEffect(() => {
  if (!bannerRef.current) return;

  const isNewRegion = prevIdRef.current !== selectedId;
  prevIdRef.current = selectedId;

  if (!region) return;

  import('gsap').then(({ default: gsap }) => {
    const banner = bannerRef.current;

    if (isNewRegion) {
      // Container entrance
      gsap.fromTo(banner,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );

      // Stagger inner elements
      const accent = banner.querySelector('.region-banner-accent');
      const close = banner.querySelector('.region-banner-close');
      const overline = banner.querySelector('.region-banner-overline');
      const title = banner.querySelector('.region-banner-title');
      const footer = banner.querySelector('.region-banner-footer');

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out', duration: 0.35 } });
      if (accent) tl.fromTo(accent, { width: 0 }, { width: 3 }, 0);
      if (overline) tl.fromTo(overline, { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.05);
      if (title) tl.fromTo(title, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.12);
      if (footer) tl.fromTo(footer, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.2);
      if (close) tl.fromTo(close, { opacity: 0, rotation: -90 }, { opacity: 1, rotation: 0 }, 0.25);
    } else {
      gsap.set(banner, { opacity: 1, y: 0, scale: 1 });
    }
  });
}, [selectedId]);
```

### 4. CSS — `will-change` additions

**HeroSection.astro style:**
- `.hero-bg` already has `will-change: transform, opacity` ✓
- `.hero-word` already has `will-change: transform, opacity, filter` ✓

**index.astro style:**
- Add `will-change: opacity` to `.map-ocean-bg`
- Add `will-change: transform, opacity` to `.interactive-map`

### Files Affected (execution order)

1. `src/components/astro/home/HeroSection.astro` — script
2. `src/pages/index.astro` — script + CSS (will-change)
3. `src/components/react/home/RegionBanner.tsx` — useEffect
4. Build verify

### 1. `src/components/astro/home/HeroSection.astro` (line 34-39)

```astro
<p class="hero-subtitle">
  Jelajahi <strong class="hero-strong">{foods.length}+</strong> hidangan khas dari
  <strong class="hero-strong">{regionCount}</strong> wilayah Nusantara.
</p>
```

**Before:** `Satu Nusantara, tak terbatas rasa.` (2 baris, klise)  
**After:** 1 baris, natural, langsung.

### 2. `src/pages/index.astro` (line 20)

```astro
subtitle="Klik pulau, temukan hidangan khasnya."
```

**Before:** `Pilih pulau untuk menemukan cerita rasa dari setiap daerah`  
**After:** Lebih pendek, conversational.

### 3. `src/components/react/home/FeaturedFoodsGrid.tsx` (line 55-58, + JSX)

```ts
const title = region ? `Hidangan ${region.name}` : 'Hidangan Pilihan';
const subtitle = region ? '' : 'Hidangan dari seluruh Nusantara';
```

JSX — conditional render subtitle:
```tsx
{subtitle && <p className="featured-subtitle">{subtitle}</p>}
```

JSX — tambah pagination status di pagination bar (sebelum `</div>`):
```tsx
{totalPages > 1 && (
  <span className="pagination-status">Halaman {page} dari {totalPages}</span>
)}
```

CSS tambahan di FeaturedFoodsGrid.css:
```css
.pagination-status {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
  font-weight: 600;
  width: 100%;
  text-align: center;
  margin-top: var(--sp-2);
}
```

**Changes:**
- Subtitle tanpa angka, general saja
- Region selected → subtitle tidak muncul (title sudah cukup)
- Page info pindah ke pagination bar sebagai `.pagination-status`

### 4. `src/components/astro/shared/Footer.astro` (line 26-27)

```astro
<a href="/" class="footer-logo" aria-label="Kulineria Beranda">Kulineria</a>
<p class="footer-tagline">Atlas Kuliner Nusantara.<br/>Jelajahi cita rasa Indonesia.</p>
```

**Before:** `—` em dash + `ragam cita rasa`  
**After:** Titik ganti em dash, `ragam` dihapus, aria-label tanpa em dash.

---

## Eksekusi Copy

5 file:
1. `HeroSection.astro` — subtitle tanpa angka
2. `index.astro` — SectionHeader subtitle (map)
3. `FeaturedFoodsGrid.tsx` — subtitle general, pagination status baru
4. `FeaturedFoodsGrid.css` — `.pagination-status` style
5. `Footer.astro` — tagline + aria-label

---

## File Size Impact (Total)

| File | Before | After | Delta |
|------|--------|-------|-------|
| section-transitions.css | — | 0.9 kB | +0.9 kB |
| index.astro | 5.0 kB | 7.2 kB | +2.2 kB (mostly script) |
| HeroSection.astro | 7.8 kB | 8.0 kB | +0.2 kB |
| FeaturedFoodsGrid.css | 6.1 kB | 6.1 kB | +1 line |
| **Total** | | | **+3.3 kB** |

GSAP ScrollTrigger sudah termasuk dalam bundle gsap (tidak ada tambahan dependency).
