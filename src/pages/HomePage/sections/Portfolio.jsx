import { useState } from 'react'
import { Link } from 'react-router-dom'
import { portfolioFlats, portfolioHouses } from '../../../shared/data/content'
import FadeInView from '../../../shared/ui/FadeInView'

const TABS = [
  { key: 'flats',  label: 'Дизайн-проект квартир', items: portfolioFlats },
  { key: 'houses', label: 'Дизайн-проект домов',   items: portfolioHouses },
]

const GRAD_PAIRS = [
  ['#2A3560', '#1E2240'],
  ['#8BDFDD', '#5BC8C5'],
  ['#F48F68', '#E07A54'],
  ['#FFE394', '#F5B800'],
  ['#243050', '#1C2340'],
  ['#8BDFDD', '#6ECFCD'],
]

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('flats')
  const current = TABS.find((t) => t.key === activeTab)

  return (
    <section className="py-24" style={{ background: '#FFF6DE' }} id="portfolio">
      <div className="container">
        <FadeInView>
          <div className="mb-10">
            <p className="section-tag-light">Наши работы</p>
            <h2 className="section-title-light max-w-2xl">
              500+ проектов по всей России и СНГ
            </h2>
            <p className="section-sub-light">
              Каждый — под конкретного человека и конкретную жизнь
            </p>
          </div>
        </FadeInView>

        {/* Табы */}
        <FadeInView delay={0.1}>
          <div
            className="flex gap-2 mb-8 border-b"
            style={{ borderColor: 'rgba(26,18,11,0.08)' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-5 py-3 text-sm font-medium rounded-t-xl transition-all duration-200 border-b-2"
                style={{
                  color: activeTab === tab.key ? '#F48F68' : 'rgba(26,18,11,0.45)',
                  borderBottomColor: activeTab === tab.key ? '#F48F68' : 'transparent',
                  background: activeTab === tab.key ? 'rgba(244,143,104,0.07)' : 'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </FadeInView>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {current.items.map((item, i) => (
            <FadeInView key={i} delay={i * 0.07}>
              <div
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ border: '2px solid rgba(139,223,221,0.2)' }}
              >
                {/* Обложка */}
                <div
                  className="h-52 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${GRAD_PAIRS[i % GRAD_PAIRS.length][0]}, ${GRAD_PAIRS[i % GRAD_PAIRS.length][1]})` }}
                >
                  <div
                    className="absolute inset-0 opacity-10 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: "url('/hero-bg.jpg')" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-5xl font-bold"
                      style={{ color: 'rgba(255,255,255,0.15)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {item.style && (
                    <span
                      className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(4px)' }}
                    >
                      {item.style}
                    </span>
                  )}
                </div>

                {/* Описание */}
                <div className="p-4" style={{ background: '#FFFFFF' }}>
                  <h3 className="text-[#1A120B] text-sm font-semibold mb-1">{item.title}</h3>
                  <p className="text-[#1A120B]/45 text-xs">{item.area} · {item.city}</p>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>

        {/* CTA */}
        <FadeInView delay={0.2} className="flex flex-wrap gap-4 justify-center mt-10">
          <Link to="/portfolio" className="btn-coral">Смотреть полное портфолио</Link>
          <a href="/#contacts" className="btn-outline">Обсудить свой проект</a>
        </FadeInView>
      </div>
    </section>
  )
}
