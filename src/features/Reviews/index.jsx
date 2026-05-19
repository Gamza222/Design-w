import { useState, useEffect } from 'react'
import { reviews } from '../../shared/data/reviews'
import FadeInView from '../../shared/ui/FadeInView'

/* ────────────────────────────────────────────
   Masonry‑колонки для отзывов (homepage — ПРЕВЬЮ)
   – жёстко зафиксированные 3 колонки с конкретными отзывами
   – Колонка 1: review1, review4, review7  (3 шт)
   – Колонка 2: review3, review6           (2 шт — из бывшей 3-й колонки)
   – Колонка 3: review2, review5, review8, review11 (4 шт — из бывшей 2-й)
   – градиент-fade снизу
   – кнопка ведёт на /reviews в новой вкладке
──────────────────────────────────────────── */

/* ── Жёстко зафиксированные колонки превью ── */
const PREVIEW_COLUMNS = [
  // Колонка 1: review1, review4, review7
  [0, 3, 6],
  // Колонка 2: review3, review6 (из бывшей 3-й колонки)
  [2, 5],
  // Колонка 3: review2, review5, review8, review11 (из бывшей 2-й колонки)
  [1, 4, 7, 10],
]

export default function Reviews() {
  const [lightbox, setLightbox] = useState(null)

  const total = reviews.length

  /* ── Собираем колонки из зафиксированных индексов ── */
  const columns = PREVIEW_COLUMNS.map((indices) =>
    indices.map((i) => ({ ...reviews[i], globalIndex: i }))
  )

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
    <section className="py-24 bg-[#243050]" id="reviews">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-10">
            <p className="section-tag">Отзывы</p>
            <h2 className="section-title">Что говорят наши клиенты</h2>
            <p className="section-sub mt-3">
              Реальные впечатления тех, с кем мы уже работали
            </p>
          </div>
        </FadeInView>

        {/* ── Masonry Grid — зафиксированное превью ── */}
        <div className="reviews-masonry-wrap">
          <div className="reviews-masonry">
            {columns.map((col, colIdx) => (
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

          {/* Gradient fade at bottom — всегда виден */}
          <div className="reviews-fade" />
        </div>

        {/* ── Link to full reviews page (new tab) ── */}
        <div className="flex justify-center mt-6">
          <a
            href="/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark"
          >
            Показать все отзывы
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
