import { useRef } from 'react'
import FadeInView from '../../../shared/ui/FadeInView'

const STATS = [
  { num: '500+', label: 'выполненных проектов' },
  { num: '5 лет', label: 'на рынке дизайна' },
  { num: '50+',   label: 'городов присутствия' },
  { num: '4.9 ★', label: 'оценка на Яндексе' },
]

const ABOUT_ITEMS = [
  'Работаем по всей России и СНГ онлайн',
  'Команда из 50+ профессиональных дизайнеров',
  'Отвечаем на заявку в течение 30 минут',
  'Фиксированная цена — без скрытых доплат',
]

/*
  ВАЖНО по грамотам:
  - gramota1.jpg — вертикальная, НЕ растягивать на всю рамку → object-contain
  - gramota2.jpg — горизонтальная, заполнять рамку → object-cover
*/
const AWARDS = [
  {
    src: '/gramota1.jpg',
    alt: 'Грамота 1',
    // НЕ на всю рамку — отображаем как есть с паддингом
    objectFit: 'contain',
    bg: '#f5f5f0',
  },
  {
    src: '/gramota2.jpg',
    alt: 'Грамота 2',
    // НА всю рамку
    objectFit: 'cover',
    bg: '#1C2340',
  },
]

export default function About() {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-24" style={{ background: '#FFFFFF' }} id="about">
      <div className="container">

        {/* ── ОСНОВНАЯ ЧАСТЬ ── */}
        <FadeInView>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">

            {/* Текст */}
            <div>
              <p className="section-tag-light">О студии</p>
              <h2 className="section-title-light mb-6">
                Мы не бросаем клиентов после выдачи чертежей
              </h2>
              <ul className="space-y-3 mb-8">
                {ABOUT_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#1A120B]/75 text-sm leading-relaxed">
                    <span
                      className="shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: '#8BDFDD' }}
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/#contacts" className="btn-coral">Обсудить проект</a>
            </div>

            {/* Цифры */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((c) => (
                <div
                  key={c.num}
                  className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: '#FFF6DE',
                    border: '2px solid rgba(139,223,221,0.3)',
                  }}
                >
                  <div
                    className="text-2xl md:text-3xl font-bold mb-1"
                    style={{ color: '#F48F68' }}
                  >
                    {c.num}
                  </div>
                  <p className="text-[#1A120B]/60 text-sm">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInView>

        {/* ── ДОСТИЖЕНИЯ ── */}
        <div id="achievements">
          <FadeInView>
            <p
              className="text-center text-sm mb-6"
              style={{ color: '#1A120B', opacity: 0.45 }}
            >
              Дипломы и награды — от Сообщества дизайнеров интерьера России
            </p>
          </FadeInView>

          <div className="flex items-center gap-3 justify-center">
            {/* Кнопка назад */}
            <button
              onClick={() => scroll(-1)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full
                         transition-all duration-200 text-lg font-bold"
              style={{ background: '#FFF6DE', border: '2px solid rgba(139,223,221,0.5)', color: '#1A120B' }}
            >
              ←
            </button>

            {/* Скролл-контейнер грамот */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                maxWidth: '860px',
              }}
            >
              {AWARDS.map((award, i) => (
                <div
                  key={i}
                  className="shrink-0 rounded-2xl overflow-hidden"
                  style={{
                    width: '400px',
                    minWidth: '260px',
                    border: '2px solid rgba(139,223,221,0.3)',
                    background: award.bg,
                  }}
                >
                  <img
                    src={award.src}
                    alt={award.alt}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: award.objectFit === 'cover' ? '320px' : 'auto',
                      maxHeight: '380px',
                      objectFit: award.objectFit,
                      display: 'block',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Кнопка вперёд */}
            <button
              onClick={() => scroll(1)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full
                         transition-all duration-200 text-lg font-bold"
              style={{ background: '#FFF6DE', border: '2px solid rgba(139,223,221,0.5)', color: '#1A120B' }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
