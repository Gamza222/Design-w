import { Link, useParams, Navigate } from 'react-router-dom'
import { portfolioFlats, portfolioHouses } from '../../shared/data/content'
import FadeInView from '../../shared/ui/FadeInView'

const allProjects = [...portfolioFlats, ...portfolioHouses]

const grads = [
  'from-[#2A3560] to-[#1E2240]', 'from-[#2D2A50] to-[#1A1A2E]',
  'from-[#1E3040] to-[#162030]', 'from-[#302030] to-[#1A1A2E]',
  'from-[#1E2A40] to-[#162030]', 'from-[#2A2050] to-[#1E1A30]',
]

const roomIcons = {
  'Гостиная': '🛋️', 'Кухня-столовая': '🍳', 'Кухня': '🍳', 'Кухня-гостиная': '🍳',
  'Спальня': '🛏️', 'Мастер-спальня': '🛏️', 'Детская': '🧸', 'Кабинет': '💼',
  'Санузел': '🚿', 'Прихожая': '🚪', 'Гардеробная зона': '👗', 'Терраса': '🌿',
  'Гостиная/Спальня': '🛋️', 'Основное пространство': '🏠', 'Кухня-бар': '🍳',
  'Зона ТВ': '📺', 'Каминная зона': '🔥', 'Холл': '🚪', 'Столовая': '🍽️',
  'Гостиная-кухня': '🍳', 'Обеденная зона': '🍽️', 'Бильярдная': '🎱',
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = allProjects.find((p) => p.slug === slug)
  if (!project) return <Navigate to="/portfolio" replace />

  const idx = allProjects.indexOf(project)
  const others = allProjects.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: '#1C2340' }}>
      <div className="container">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm mb-6 flex-wrap" style={{ color: 'rgba(232,228,220,0.4)' }}>
          <Link to="/" className="hover:text-[#FEC104] transition-colors">Главная</Link>
          <span>/</span>
          <Link to="/portfolio" className="hover:text-[#FEC104] transition-colors">Портфолио</Link>
          <span>/</span>
          <span className="truncate max-w-[200px]" style={{ color: '#FEC104' }}>{project.title}</span>
        </div>

        {/* Назад */}
        <Link to="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-all hover:gap-3"
          style={{ color: '#FEC104' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Все проекты
        </Link>

        {/* Hero баннер */}
        <FadeInView>
          <div className={`relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-br ${grads[idx % grads.length]}`}
            style={{ minHeight: 320 }}>
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}>
              {project.style && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full mb-4"
                  style={{ background: 'rgba(254,193,4,0.9)', color: '#1A1A2E' }}>
                  {project.style}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#E8E4DC' }}>
                {project.title}
              </h1>
              <p className="text-base" style={{ color: 'rgba(232,228,220,0.7)' }}>
                {project.area} · {project.city} · {project.type}
              </p>
            </div>
            {/* Декоративный номер */}
            <div className="absolute top-8 right-8 text-8xl font-black select-none"
              style={{ color: 'rgba(254,193,4,0.08)' }}>
              {String(idx + 1).padStart(2, '0')}
            </div>
          </div>
        </FadeInView>

        {/* Описание + мета */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <FadeInView className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#E8E4DC' }}>О проекте</h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(232,228,220,0.65)' }}>{project.desc}</p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <div className="rounded-2xl p-6 space-y-4" style={{ background: '#1E2240', border: '1px solid rgba(254,193,4,0.15)' }}>
              {[
                { label: 'Площадь', value: project.area },
                { label: 'Город', value: project.city },
                { label: 'Стиль', value: project.style },
                { label: 'Тип объекта', value: project.type },
              ].map((row) => (
                <div key={row.label}>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'rgba(232,228,220,0.35)' }}>{row.label}</p>
                  <p className="font-semibold text-sm" style={{ color: '#E8E4DC' }}>{row.value}</p>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>

        {/* Помещения */}
        {project.rooms?.length > 0 && (
          <>
            <FadeInView>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#E8E4DC' }}>Помещения в проекте</h2>
            </FadeInView>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
              {project.rooms.map((room, i) => (
                <FadeInView key={room} delay={i * 0.05}>
                  <div className={`rounded-2xl overflow-hidden bg-gradient-to-br ${grads[(idx + i + 1) % grads.length]}`}
                    style={{ border: '1px solid rgba(254,193,4,0.12)' }}>
                    <div className="aspect-[4/3] flex flex-col items-center justify-center gap-2 p-4">
                      <span className="text-3xl">{roomIcons[room] || '🏠'}</span>
                      <p className="text-xs font-medium text-center" style={{ color: 'rgba(232,228,220,0.8)' }}>{room}</p>
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <FadeInView>
          <div className="rounded-3xl p-10 text-center mb-16" style={{ background: '#1E2240', border: '1px solid rgba(254,193,4,0.2)' }}>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#E8E4DC' }}>Хотите похожий проект?</h2>
            <p className="text-sm mb-7" style={{ color: 'rgba(232,228,220,0.6)' }}>
              Расскажите о вашей квартире — рассчитаем стоимость за 30 минут.
            </p>
            <Link to="/contacts" className="btn-gold">Обсудить проект</Link>
          </div>
        </FadeInView>

        {/* Другие проекты */}
        {others.length > 0 && (
          <>
            <FadeInView>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#E8E4DC' }}>Другие проекты</h2>
            </FadeInView>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {others.map((other, i) => {
                const oi = allProjects.indexOf(other)
                return (
                  <FadeInView key={other.slug} delay={i * 0.07}>
                    <Link to={`/portfolio/${other.slug}`}
                      className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                      style={{ border: '1px solid rgba(254,193,4,0.1)' }}>
                      <div className={`h-40 bg-gradient-to-br ${grads[oi % grads.length]} relative overflow-hidden`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-black" style={{ color: 'rgba(254,193,4,0.15)' }}>
                            {String(oi + 1).padStart(2, '0')}
                          </span>
                        </div>
                        {other.style && (
                          <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full"
                            style={{ color: '#FEC104', background: 'rgba(26,26,46,0.85)' }}>
                            {other.style}
                          </span>
                        )}
                      </div>
                      <div className="p-4" style={{ background: '#1E2240' }}>
                        <h3 className="text-sm font-medium mb-1 group-hover:text-[#FEC104] transition-colors"
                          style={{ color: '#E8E4DC' }}>{other.title}</h3>
                        <p className="text-xs" style={{ color: 'rgba(232,228,220,0.4)' }}>{other.area} · {other.city}</p>
                      </div>
                    </Link>
                  </FadeInView>
                )
              })}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
