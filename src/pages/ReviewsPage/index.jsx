import { useState, useEffect, useCallback } from 'react'
import { reviews } from '../../shared/data/reviews'
import FadeInView from '../../shared/ui/FadeInView'

/* ────────────────────────────────────────────
   Полная страница отзывов — все в masonry
   Колонки автоматически балансируются по высоте:
   каждый отзыв кидается в самую короткую колонку
   (greedy алгоритм по aspect ratio изображений)
──────────────────────────────────────────── */

/* ── Загружаем натуральные размеры всех картинок ── */
function preloadDimensions(items) {
  return Promise.all(
    items.map(
      (r) =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = () =>
            resolve({ ...r, ratio: img.naturalHeight / img.naturalWidth })
          img.onerror = () => resolve({ ...r, ratio: 1 }) // fallback 1:1
          img.src = r.src
        })
    )
  )
}

/* ── Жадная балансировка: кидаем в самую короткую колонку ── */
function balanceColumns(items, numCols) {
  const buckets = Array.from({ length: numCols }, () => [])
  const heights = Array.from({ length: numCols }, () => 0)

  items.forEach((item) => {
    // Находим колонку с минимальной суммарной высотой
    let minIdx = 0
    for (let c = 1; c < numCols; c++) {
      if (heights[c] < heights[minIdx]) minIdx = c
    }
    buckets[minIdx].push(item)
    heights[minIdx] += item.ratio // ratio = height/width, нормализованная «высота»
  })

  return buckets
}

export default function ReviewsPage() {
  const [lightbox, setLightbox] = useState(null)
  const [cols, setCols] = useState(3)
  const [balanced, setBalanced] = useState(null) // balanced columns

  const total = reviews.length

  /* ── Scroll to top on mount ────────────── */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  /* ── Responsive columns ────────────────── */
  useEffect(() => {
    const calc = () => {
      if (window.innerWidth < 580) setCols(1)
      else if (window.innerWidth < 900) setCols(2)
      else setCols(3)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  /* ── Preload images & balance columns whenever cols changes ── */
  useEffect(() => {
    let cancelled = false
    const indexed = reviews.map((r, i) => ({ ...r, globalIndex: i }))
    preloadDimensions(indexed).then((items) => {
      if (!cancelled) setBalanced(balanceColumns(items, cols))
    })
    return () => { cancelled = true }
  }, [cols])

  /* ── Fallback: round-robin until images load ── */
  const columns = useCallback(() => {
    if (balanced) return balanced
    const buckets = Array.from({ length: cols }, () => [])
    reviews.forEach((r, i) => {
      buckets[i % cols].push({ ...r, globalIndex: i })
    })
    return buckets
  }, [cols, balanced])

  /* ── Lightbox ──────────────────────────── */
  const openLightbox = (idx) => {
    setLightbox(idx)
    document.body.style.overflow = 'hidden'
  }
  const closeLightbox = () => {
    setLightbox(null)
    document.body.style.overflow = ''
  }

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') setLightbox((l) => (l > 0 ? l - 1 : total - 1))
      if (e.key === 'ArrowRight') setLightbox((l) => (l < total - 1 ? l + 1 : 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, total])

  return (
    <section className="pt-32 pb-24 bg-[#243050] min-h-screen" id="all-reviews">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag">Отзывы</p>
            <h2 className="section-title">Все отзывы наших клиентов</h2>
            <p className="section-sub mt-3">
              Каждый отзыв — подтверждение нашего подхода к делу
            </p>
          </div>
        </FadeInView>

        {/* ── Full masonry grid ──────────────── */}
        <div
          className="reviews-masonry"
          style={{ '--cols': cols }}
        >
          {columns().map((col, colIdx) => (
            <div key={colIdx} className="reviews-masonry-col">
              {col.map((r) => (
                <div
                  key={r.id}
                  className="reviews-card"
                  onClick={() => openLightbox(r.globalIndex)}
                >
                  <img
                    src={r.src}
                    alt={r.alt}
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Back to home ───────────────────── */}
        <div className="flex justify-center mt-10">
          <a
            href="/#reviews"
            className="btn-dark"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12l6 6M5 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            На главную
          </a>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────── */}
      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l > 0 ? l - 1 : total - 1)) }}
            className="absolute left-4 text-white/70 hover:text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <img
            src={reviews[lightbox].src}
            alt={reviews[lightbox].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />

          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l < total - 1 ? l + 1 : 0)) }}
            className="absolute right-4 text-white/70 hover:text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="absolute bottom-5 text-white/50 text-sm">
            {lightbox + 1} / {total}
          </div>
        </div>
      )}
    </section>
  )
}
