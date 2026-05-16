import { useState } from 'react'
import { Link } from 'react-router-dom'
import { portfolioFlats, portfolioHouses } from '../../../shared/data/content'
import FadeInView from '../../../shared/ui/FadeInView'

const tabs = [
  { key: 'flats', label: 'Дизайн-проект квартир', items: portfolioFlats },
  { key: 'houses', label: 'Дизайн-проект домов', items: portfolioHouses },
]

const placeholderColors = [
  'from-[#2A3560] to-[#1E2240]',
  'from-[#2D2A50] to-[#1A1A2E]',
  'from-[#1E3040] to-[#162030]',
  'from-[#302030] to-[#1A1A2E]',
]

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('flats')
  const current = tabs.find((t) => t.key === activeTab)

  return (
    <section className="py-24 bg-[#1C2340]" id="portfolio">
      <div className="container">
        <FadeInView>
          <div className="mb-10">
            <p className="section-tag">Наши работы</p>
            <h2 className="section-title max-w-3xl">
              Выполнили 500+ проектов по всей России и СНГ.{' '}
              <span className="text-[rgba(232,228,220,0.6)] font-normal text-2xl md:text-3xl">
                Каждый под конкретного человека, под конкретную жизнь.
              </span>
            </h2>
          </div>
        </FadeInView>

        {/* Табы */}
        <FadeInView delay={0.1}>
          <div className="flex gap-2 mb-8 border-b border-[rgba(201,169,122,0.15)] pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-medium rounded-t-xl transition-all duration-200 border-b-2 ${
                  activeTab === tab.key
                    ? 'text-[#C9A97A] border-[#C9A97A] bg-[rgba(201,169,122,0.08)]'
                    : 'text-[rgba(232,228,220,0.5)] border-transparent hover:text-[#E8E4DC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </FadeInView>

        {/* Сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {current.items.map((item, i) => (
            <FadeInView key={i} delay={i * 0.08}>
              <div className="group rounded-2xl overflow-hidden border border-[rgba(201,169,122,0.1)] hover:border-[rgba(201,169,122,0.3)] transition-all duration-300 h-full">
                <div className={`h-52 bg-gradient-to-br ${placeholderColors[i % placeholderColors.length]} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20 bg-[url('/hero-bg.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4">
                    <span className="text-[rgba(201,169,122,0.3)] text-4xl font-bold">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  {item.style && (
                    <span className="absolute top-3 left-3 text-[10px] font-semibold text-[#C9A97A] bg-[rgba(26,26,46,0.85)] px-2 py-1 rounded-full">
                      {item.style}
                    </span>
                  )}
                </div>
                <div className="bg-[#1E2240] p-4">
                  <h3 className="text-[#E8E4DC] text-sm font-medium mb-1">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[rgba(232,228,220,0.4)] text-xs">{item.area} · {item.city}</span>
                  </div>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>

        <FadeInView delay={0.2} className="flex flex-wrap gap-4 justify-center mt-10">
          <Link to="/portfolio" className="btn-gold">Смотреть полное портфолио</Link>
          <a href="#catalog" className="btn-outline">Получить каталог проектов PDF</a>
        </FadeInView>
      </div>
    </section>
  )
}
