import { useState, useEffect, useRef, useCallback } from 'react'
import { reviews } from '../../shared/data/reviews'
import FadeInView from '../../shared/ui/FadeInView'

export default function Reviews() {
  const [current, setCurrent] = useState(0)
  const [perView, setPerView] = useState(3)
  const [lightbox, setLightbox] = useState(null)
  const [trackHeight, setTrackHeight] = useState('auto')
  const trackRef = useRef(null)
  const autoRef = useRef(null)

  const total = reviews.length
  const max = Math.max(0, total - perView)
  // Количество точек = количество позиций слайдера
  const dotsCount = max + 1

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

  // Зацикленная навигация
  const goTo = useCallback((idx) => {
    if (idx < 0) setCurrent(max)
    else if (idx > max) setCurrent(0)
    else setCurrent(idx)
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

  // Сдвиг трека
  useEffect(() => {
    if (!trackRef.current) return
    const slide = trackRef.current.children[0]
    if (!slide) return
    const slideW = slide.offsetWidth + 18
    trackRef.current.style.transform = `translateX(-${current * slideW}px)`
  }, [current, perView])

  // Высота viewport = max высота среди всех слайдов
  useEffect(() => {
    if (!trackRef.current) return

    const measureMax = () => {
      if (!trackRef.current) return
      const children = Array.from(trackRef.current.children)
      if (!children.length) return
      const maxH = children.reduce((acc, el) => Math.max(acc, el.scrollHeight), 0)
      if (maxH > 0) setTrackHeight(maxH)
    }

    const imgs = trackRef.current.querySelectorAll('img')
    let loaded = 0
    const onLoad = () => {
      loaded++
      if (loaded >= imgs.length) measureMax()
    }

    if (imgs.length === 0) {
      measureMax()
    } else {
      imgs.forEach((img) => {
        if (img.complete) {
          onLoad()
        } else {
          img.addEventListener('load', onLoad)
          img.addEventListener('error', onLoad)
        }
      })
    }

    window.addEventListener('resize', measureMax)
    return () => window.removeEventListener('resize', measureMax)
  }, [perView, total])

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
          </div>
        </FadeInView>

        <div className="relative" onMouseEnter={stopAuto} onMouseLeave={startAuto}>
          {/* Стрелка влево — зациклена */}
          <button
            onClick={() => goTo(current - 1)}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[rgba(26,26,46,0.9)] border border-[rgba(254,193,4,0.2)] text-[#FEC104] hover:bg-[rgba(254,193,4,0.1)] transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Viewport — фиксированная высота по самому высокому слайду */}
          <div
            className="reviews-viewport mx-4"
            style={{
              height: trackHeight !== 'auto' ? trackHeight : undefined,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              ref={trackRef}
              className="reviews-track w-full"
              style={{ gap: 18, alignItems: 'center' }}
            >
              {reviews.map((r, i) => (
                <div
                  key={r.id}
                  className="shrink-0 rounded-2xl overflow-hidden cursor-zoom-in border border-[rgba(254,193,4,0.1)] hover:border-[rgba(254,193,4,0.3)] transition-all"
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

          {/* Стрелка вправо — зациклена */}
          <button
            onClick={() => goTo(current + 1)}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[rgba(26,26,46,0.9)] border border-[rgba(254,193,4,0.2)] text-[#FEC104] hover:bg-[rgba(254,193,4,0.1)] transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Точки — ровно столько, сколько позиций слайдера (max+1) */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: dotsCount }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-[#FEC104]' : 'w-2 h-2 bg-[rgba(254,193,4,0.3)]'
              }`}
              aria-label={`Слайд ${i + 1}`}
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
