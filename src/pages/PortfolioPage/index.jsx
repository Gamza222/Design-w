import { useState } from 'react'
import { Link } from 'react-router-dom'
import { portfolioFlats, portfolioHouses } from '../../shared/data/content'
import FadeInView from '../../shared/ui/FadeInView'

const tabs = [
  { key: 'flats', label: 'Квартиры', items: portfolioFlats },
  { key: 'houses', label: 'Дома', items: portfolioHouses },
]

const gradients = [
  'from-[#2A3560] to-[#1E2240]',
  'from-[#2D2A50] to-[#1A1A2E]',
  'from-[#1E3040] to-[#162030]',
  'from-[#302030] to-[#1A1A2E]',
  'from-[#1E2A40] to-[#162030]',
  'from-[#2A2050] to-[#1E1A30]',
]

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('flats')
  const current = tabs.find((t) => t.key === activeTab)

  return (
    <div className="min-h-screen bg-[#1C2340] pt-24 pb-16">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[rgba(232,228,220,0.4)] mb-8">
          <Link to="/" className="hover:text-[#FEC104] transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-[#FEC104]">Портфолио</span>
        </div>

        <FadeInView>
          <p className="section-tag">Наши работы</p>
          <h1 className="section-title mb-4 max-w-3xl">
            Полное портфолио проектов
          </h1>
          <p className="section-sub mb-10">
            500+ завершённых проектов по всей России и СНГ. Каждый — под конкретного человека и конкретную жизнь.
          </p>
        </FadeInView>

        {/* Табы */}
        <div className="flex gap-2 mb-8 border-b border-[rgba(254,193,4,0.15)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium rounded-t-xl transition-all duration-200 border-b-2 ${
                activeTab === tab.key
                  ? 'text-[#FEC104] border-[#FEC104] bg-[rgba(254,193,4,0.08)]'
                  : 'text-[rgba(232,228,220,0.5)] border-transparent hover:text-[#E8E4DC]'
              }`}
            >
              {tab.label} ({tab.items.length})
            </button>
          ))}
        </div>

        {/* Сетка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {current.items.map((item, i) => (
            <FadeInView key={i} delay={i * 0.06}>
              <Link
                to={`/portfolio/${item.slug}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid rgba(254,193,4,0.1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(254,193,4,0.35)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(254,193,4,0.1)' }}
              >
                <div className={`h-56 bg-gradient-to-br ${gradients[i % gradients.length]} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20 bg-[url('/hero-bg.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-[rgba(254,193,4,0.15)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {item.style && (
                    <span className="absolute top-3 left-3 text-[10px] font-semibold text-[#FEC104] bg-[rgba(26,26,46,0.85)] px-2 py-1 rounded-full">
                      {item.style}
                    </span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(254,193,4,0.12)' }}>
                    <span className="text-xs font-bold px-4 py-2 rounded-full"
                      style={{ background: '#FEC104', color: '#1A1A2E' }}>Смотреть проект</span>
                  </div>
                </div>
                <div className="bg-[#1E2240] p-4">
                  <h3 className="text-[#E8E4DC] text-sm font-medium mb-1 group-hover:text-[#FEC104] transition-colors">{item.title}</h3>
                  <p className="text-[rgba(232,228,220,0.4)] text-xs">{item.area} · {item.city}</p>
                </div>
              </Link>
            </FadeInView>
          ))}
        </div>

        {/* CTA */}
        <FadeInView delay={0.3} className="text-center mt-16">
          <div className="bg-[#1E2240] border border-[rgba(254,193,4,0.15)] rounded-3xl p-10 max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-[#E8E4DC] mb-3">Хотите такой же проект?</h2>
            <p className="text-[rgba(232,228,220,0.6)] text-sm mb-6">
              Расскажите о вашей квартире — мы рассчитаем стоимость за 30 минут.
            </p>
            <Link to="/#contacts" className="btn-gold">Обсудить проект</Link>
          </div>
        </FadeInView>
      </div>
    </div>
  )
}
