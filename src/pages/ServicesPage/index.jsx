import { Link } from 'react-router-dom'
import { tariffs, extras } from '../../shared/data/services'
import FadeInView from '../../shared/ui/FadeInView'

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <path d="M5 13l4 4L19 7" stroke="#FEC104" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: '#1A1A2E' }}>
      <div className="container">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'rgba(232,228,220,0.4)' }}>
          <Link to="/" className="hover:text-[#FEC104] transition-colors">Главная</Link>
          <span>/</span>
          <span style={{ color: '#FEC104' }}>Дизайн-проект</span>
        </div>

        <FadeInView>
          <p className="section-tag">Услуги студии</p>
          <h1 className="section-title mb-4 max-w-3xl">Дизайн-проект интерьера — все пакеты</h1>
          <p className="section-sub mb-16">
            Выберите пакет под ваши задачи. Каждый тариф можно дополнить услугами из раздела ниже.
          </p>
        </FadeInView>

        {/* Тарифы */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-24">
          {tariffs.map((t, i) => {
            const isPopular = t.id === 'tariff5'
            return (
              <FadeInView key={t.id} delay={i * 0.07}>
                <div
                  className="relative rounded-2xl p-7 flex flex-col h-full transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: isPopular ? 'rgba(254,193,4,0.07)' : '#1E2240',
                    border: isPopular ? '1px solid #FEC104' : '1px solid rgba(254,193,4,0.15)',
                    boxShadow: isPopular ? '0 0 40px rgba(254,193,4,0.1)' : undefined,
                  }}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full"
                        style={{ background: '#FEC104', color: '#1A1A2E' }}>
                        Популярный
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl font-black" style={{ color: 'rgba(254,193,4,0.25)' }}>{t.num}</span>
                    {t.includes3D && (
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: '#FEC104', background: 'rgba(254,193,4,0.1)', border: '1px solid rgba(254,193,4,0.3)' }}>
                        3D включено
                      </span>
                    )}
                  </div>

                  <h2 className="font-bold text-lg mb-2" style={{ color: '#E8E4DC' }}>{t.title}</h2>
                  <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(232,228,220,0.5)' }}>{t.short}</p>
                  <div className="text-2xl font-black mb-5" style={{ color: '#FEC104' }}>{t.priceLabel}</div>

                  <ul className="space-y-2.5 mb-7 flex-1">
                    {t.items.map((item) => (
                      <li key={item} className="flex items-start gap-2" style={{ color: 'rgba(232,228,220,0.7)', fontSize: 13 }}>
                        <Check />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/contacts"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border-2 text-center"
                    style={isPopular
                      ? { background: '#FEC104', color: '#1A1A2E', borderColor: '#FEC104' }
                      : { background: 'transparent', color: '#FEC104', borderColor: 'rgba(254,193,4,0.45)' }
                    }
                    onMouseEnter={(e) => {
                      if (isPopular) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FEC104' }
                      else { e.currentTarget.style.background = 'rgba(254,193,4,0.08)'; e.currentTarget.style.borderColor = '#FEC104' }
                    }}
                    onMouseLeave={(e) => {
                      if (isPopular) { e.currentTarget.style.background = '#FEC104'; e.currentTarget.style.color = '#1A1A2E' }
                      else { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(254,193,4,0.45)' }
                    }}
                  >
                    {t.btnText}
                  </Link>
                </div>
              </FadeInView>
            )
          })}
        </div>

        {/* Доп. услуги */}
        <FadeInView>
          <p className="section-tag">Дополнительно</p>
          <h2 className="section-title mb-3">Дополнительные услуги</h2>
          <p className="section-sub mb-12">Можно добавить к любому пакету или заказать отдельно.</p>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {extras.map((ex, i) => (
            <FadeInView key={ex.id} delay={i * 0.07}>
              <div className="rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: '#1E2240', border: '1px solid rgba(254,193,4,0.12)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(254,193,4,0.35)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(254,193,4,0.12)' }}
              >
                <h3 className="font-bold text-base mb-2" style={{ color: '#E8E4DC' }}>{ex.title}</h3>
                <p className="text-sm mb-4 flex-1" style={{ color: 'rgba(232,228,220,0.5)' }}>{ex.short}</p>
                <div className="font-bold mb-4" style={{ color: '#FEC104' }}>{ex.priceLabel}</div>
                <ul className="space-y-2">
                  {ex.items.map((item) => (
                    <li key={item} className="flex items-start gap-2" style={{ color: 'rgba(232,228,220,0.6)', fontSize: 12 }}>
                      <Check />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInView>
          ))}
        </div>

        {/* CTA */}
        <FadeInView>
          <div className="rounded-3xl p-10 text-center max-w-xl mx-auto"
            style={{ background: '#1E2240', border: '1px solid rgba(254,193,4,0.2)' }}>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#E8E4DC' }}>Не знаете, что выбрать?</h2>
            <p className="text-sm mb-7" style={{ color: 'rgba(232,228,220,0.6)' }}>
              Напишите нам — расскажем, какой пакет подойдёт под ваши задачи и бюджет.
            </p>
            <Link to="/contacts" className="btn-gold">Получить консультацию</Link>
          </div>
        </FadeInView>

      </div>
    </div>
  )
}
