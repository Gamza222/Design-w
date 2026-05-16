import { useState, useRef, useEffect, useCallback } from 'react'
import { reviews } from '../../shared/data/reviews'
import FadeInView from '../../shared/ui/FadeInView'

/* ──────────────────────────────────────────────────────────
   REVIEWS SLIDER
   - CSS scroll-snap (надёжнее JS transform при ресайзе)
   - Рамка тянется ровно по высоте изображения (h-auto)
   - Lightbox с клавиатурной навигацией
────────────────────────────────────────────────────────── */

function getPerView() {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth < 480) return 1
  if (window.innerWidth < 768) return 2
  return 3
}

export default function Reviews() {
  const [lightbox, setLightbox] = useState(null)
  const [perView, setPerView] = useState(getPerView)
  const [current, setCurrent] = useState(0)
  const scrollRef = useRef(null)
  const autoRef = useRef(null)
  const total = reviews.length

  /* Обновляем perView при ресайзе */
  useEffect(() => {
    const onResize = () => {
      const next = getPerView()
      setPerView(next)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Скроллим к нужному слайду программно */
  const scrollTo = useCallback((idx) => {
    const container = scrollRef.current
    if (!container) return
    const slides = container.querySelectorAll('.review-slide')
    if (!slides[idx]) return
    // Scroll так, чтобы слайд был слева видимой области
    container.scrollTo({ left: slides[idx].offsetLeft, behavior: 'smooth' })
    setCurrent(idx)
  }, [])

  /* Отслеживаем видимый слайд при ручном скролле */
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const onScroll = () => {
      const slides = container.querySelectorAll('.review-slide')
      let closest = 0
      let minDist = Infinity
      slides.forEach((slide, i) => {
        const dist = Math.abs(slide.offsetLeft - container.scrollLeft)
        if (dist < minDist) { minDist = dist; closest = i }
      })
      setCurrent(closest)
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  /* Автопрокрутка */
  const stopAuto = useCallback(() => clearInterval(autoRef.current), [])
  const startAuto = useCallback(() => {
    stopAuto()
    autoRef.current = setInterval(() => {
      setCurrent((c) => {
        const next = c + 1 < total ? c + 1 : 0
        scrollTo(next)
        return next
      })
    }, 4500)
  }, [total, scrollTo, stopAuto])

  useEffect(() => {
    startAuto()
    return stopAuto
  }, [startAuto, stopAuto])

  /* Lightbox */
  const openLightbox = (idx) => {
    stopAuto()
    setLightbox(idx)
    document.body.style.overflow = 'hidden'
  }
  const closeLightbox = () => {
    setLightbox(null)
    document.body.style.overflow = ''
    startAuto()
  }

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft' && lightbox > 0) setLightbox(l => l - 1)
      if (e.key === 'ArrowRight' && lightbox < total - 1) setLightbox(l => l + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, total])

  /* Ширина слайда */
  const slideWidth = `calc((100% - ${(perView - 1) * 16}px) / ${perView})`

  const canPrev = current > 0
  const canNext = current + perView < total

  return (
    <section className="py-24" style={{ background: '#FFF6DE' }} id="reviews">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag-light">Отзывы</p>
            <h2 className="section-title-light">Что говорят клиенты</h2>
            <p className="section-sub-light mx-auto">
              Реальные отзывы — скриншоты из переписок и мессенджеров
            </p>
          </div>
        </FadeInView>

        {/* Слайдер */}
        <div
          className="relative"
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
          {/* Кнопка НАЗАД */}
          <button
            onClick={() => scrollTo(Math.max(0, current - 1))}
            disabled={!canPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20
                       w-10 h-10 flex items-center justify-center rounded-full
                       bg-[#1C2340] text-white shadow-lg
                       hover:bg-[#F48F68] disabled:opacity-25 disabled:cursor-not-allowed
                       transition-all duration-200"
            aria-label="Назад"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Scroll-контейнер */}
          <div
            ref={scrollRef}
            className="reviews-scroll-container"
          >
            {reviews.map((r, i) => (
              <div
                key={r.id}
                className="review-slide"
                style={{ width: slideWidth, minWidth: slideWidth }}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={r.src}
                  alt={r.alt}
                  loading={i < perView * 2 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>

          {/* Кнопка ВПЕРЁД */}
          <button
            onClick={() => scrollTo(Math.min(total - 1, current + 1))}
            disabled={!canNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20
                       w-10 h-10 flex items-center justify-center rounded-full
                       bg-[#1C2340] text-white shadow-lg
                       hover:bg-[#F48F68] disabled:opacity-25 disabled:cursor-not-allowed
                       transition-all duration-200"
            aria-label="Вперёд"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Точки */}
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background: i === current ? '#F48F68' : 'rgba(244,143,104,0.3)',
              }}
              aria-label={`Отзыв ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          {/* Закрыть */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center
                       rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
            aria-label="Закрыть"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Назад */}
          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(l => l - 1) }}
              className="absolute left-4 w-12 h-12 flex items-center justify-center
                         rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          <img
            src={reviews[lightbox].src}
            alt={reviews[lightbox].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />

          {/* Вперёд */}
          {lightbox < total - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(l => l + 1) }}
              className="absolute right-4 w-12 h-12 flex items-center justify-center
                         rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-sm">
            {lightbox + 1} / {total}
          </div>
        </div>
      )}
    </section>
  )
}
