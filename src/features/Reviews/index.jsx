import { useState, useEffect, useRef, useCallback } from 'react'
import { reviews } from '../../shared/data/reviews'
import FadeInView from '../../shared/ui/FadeInView'

export default function Reviews() {
  const [current, setCurrent] = useState(0)
  const [perView, setPerView] = useState(3)
  const [lightbox, setLightbox] = useState(null)
  const trackRef = useRef(null)
  const autoRef = useRef(null)

  const total = reviews.length
  const max = Math.max(0, total - perView)

  useEffect(() => {
    const calc = () => {
      if (window.innerWidth < 500) setPerView(1)
      else if (window.innerWidth < 768) setPerView(2)
      else setPerView(3)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const goTo = useCallback((idx) => {
    setCurrent(Math.max(0, Math.min(idx, max)))
  }, [max])

  const startAuto = useCallback(() => {
    autoRef.current = setInterval(() => {
      setCurrent((c) => (c < max ? c + 1 : 0))
    }, 4000)
  }, [max])

  const stopAuto = () => clearInterval(autoRef.current)

  useEffect(() => {
    startAuto()
    return stopAuto
  }, [startAuto])

  useEffect(() => {
    if (!trackRef.current) return
    const slide = trackRef.current.children[0]
    if (!slide) return
    const slideW = slide.offsetWidth + 18
    trackRef.current.style.transform = `translateX(-${current * slideW}px)`
  }, [current, perView])

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
      if (e.key === 'ArrowLeft' && lightbox > 0) setLightbox(lightbox - 1)
      if (e.key === 'ArrowRight' && lightbox < total - 1) setLightbox(lightbox + 1)
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
          </div>
        </FadeInView>

        <div className="relative" onMouseEnter={stopAuto} onMouseLeave={startAuto}>
          {/* Стрелки */}
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[rgba(26,26,46,0.9)] border border-[rgba(254,193,4,0.2)] text-[#FEC104] hover:bg-[rgba(254,193,4,0.1)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="overflow-hidden mx-4">
            <div
              ref={trackRef}
              className="reviews-track"
              style={{ gap: 18 }}
            >
              {reviews.map((r, i) => (
                <div
                  key={r.id}
                  className="shrink-0 rounded-2xl overflow-hidden cursor-zoom-in border border-[rgba(254,193,4,0.1)] hover:border-[rgba(254,193,4,0.3)] transition-all inline-flex"
                  style={{ width: `calc((100% - ${(perView - 1) * 18}px) / ${perView})` }}
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={r.src}
                    alt={r.alt}
                    loading="lazy"
                    className="w-full h-auto object-contain bg-[#1E2240] block"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => goTo(current + 1)}
            disabled={current >= max}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[rgba(26,26,46,0.9)] border border-[rgba(254,193,4,0.2)] text-[#FEC104] hover:bg-[rgba(254,193,4,0.1)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Точки */}
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-[#FEC104]' : 'w-2 h-2 bg-[rgba(254,193,4,0.3)]'
              }`}
              aria-label={`Отзыв ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Лайтбокс */}
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

          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
              className="absolute left-4 text-white/70 hover:text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <img
            src={reviews[lightbox].src}
            alt={reviews[lightbox].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />

          {lightbox < total - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
              className="absolute right-4 text-white/70 hover:text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <div className="absolute bottom-5 text-white/50 text-sm">
            {lightbox + 1} / {total}
          </div>
        </div>
      )}
    </section>
  )
}
