import { useRef } from 'react'
import FadeInView from './FadeInView'

const numCards = [
  { num: '10 000+', label: 'выполненных проектов' },
  { num: '5 лет', label: 'на рынке дизайна интерьера' },
  { num: '50+', label: 'городов присутствия' },
  { num: '4.9 ★', label: 'средняя оценка на Яндексе' },
]

const aboutList = [
  'Работаем по всей России и СНГ онлайн',
  'Команда из 50+ профессиональных дизайнеров',
  'Результат за 30 минут после заявки',
  'Фиксированная цена без скрытых доплат',
]

export default function About() {
  const trackRef = useRef(null)
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const scrollAwards = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 380, behavior: 'smooth' })
    }
  }

  // Drag-scroll для грамот
  const onMouseDown = (e) => {
    isDownRef.current = true
    startXRef.current = e.pageX - trackRef.current.offsetLeft
    scrollLeftRef.current = trackRef.current.scrollLeft
  }
  const onMouseLeave = () => { isDownRef.current = false }
  const onMouseUp = () => { isDownRef.current = false }
  const onMouseMove = (e) => {
    if (!isDownRef.current) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    trackRef.current.scrollLeft = scrollLeftRef.current - (x - startXRef.current) * 1.5
  }

  return (
    <section className="py-24 bg-[#1A1A2E]" id="about">
      <div className="container">
        {/* Основная часть */}
        <FadeInView>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="section-tag">О студии</p>
            <h2 className="section-title mb-6">Мы не бросаем после выдачи чертежей</h2>
            <ul className="space-y-3 mb-8">
              {aboutList.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[rgba(232,228,220,0.8)]">
                  <span className="text-[#C9A97A] font-bold shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="#price" className="btn-gold">Рассчитать стоимость</a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {numCards.map((c) => (
              <div
                key={c.num}
                className="bg-[#1E2240] border border-[rgba(201,169,122,0.15)] rounded-2xl p-6 text-center hover:border-[rgba(201,169,122,0.35)] transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#C9A97A] to-[#F5B800] bg-clip-text text-transparent mb-1">
                  {c.num}
                </div>
                <p className="text-[rgba(232,228,220,0.6)] text-sm">{c.label}</p>
              </div>
            ))}
          </div>
          </div>
        </FadeInView>

        {/* Достижения */}
        <div id="achievements">
          <p className="text-[rgba(232,228,220,0.5)] text-sm text-center mb-6">
            Достижения — грамоты от Сообщества дизайнеров интерьера России
          </p>
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => scrollAwards(-1)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(201,169,122,0.1)] hover:bg-[rgba(201,169,122,0.2)] text-[#C9A97A] transition-all"
            >
              ←
            </button>
            <div
              ref={trackRef}
              className="flex gap-5 overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing select-none hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
            >
              {['/gramota1.jpg', '/gramota2.jpg'].map((src, i) => (
                <div
                  key={i}
                  className="shrink-0 rounded-2xl overflow-hidden border border-[rgba(201,169,122,0.15)] hover:border-[rgba(201,169,122,0.4)] transition-all"
                  style={{ width: 320, maxWidth: '80vw' }}
                >
                  <img
                    src={src}
                    alt={`Грамота ${i + 1}`}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollAwards(1)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(201,169,122,0.1)] hover:bg-[rgba(201,169,122,0.2)] text-[#C9A97A] transition-all"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
