import { useRef } from 'react'
import { Link } from 'react-router-dom'
import FadeInView from '../../shared/ui/FadeInView'

const stats = [
  { num: '500+', label: 'выполненных проектов' },
  { num: '5 лет', label: 'на рынке дизайна' },
  { num: '50+', label: 'городов России и СНГ' },
  { num: '4.9 ★', label: 'рейтинг на Яндексе' },
]

const principles = [
  { icon: '🎯', title: 'Под вашу жизнь', desc: 'Каждый проект под конкретного человека и сценарий его жизни, а не шаблон из интернета.' },
  { icon: '📐', title: 'Точные чертежи', desc: 'Строители работают по чёткой системе без ошибок и додумываний на глаз.' },
  { icon: '⚡', title: 'Быстрый старт', desc: 'Первые решения в день обращения. Полный проект в согласованные сроки.' },
  { icon: '🤝', title: 'Честная цена', desc: 'Фиксированная стоимость без скрытых доплат. Говорим прямо, если что-то не так.' },
  { icon: '🌍', title: 'Онлайн-формат', desc: 'Работаем по всей России и СНГ. Расстояние не влияет на качество проекта.' },
  { icon: '💬', title: 'На связи всегда', desc: 'Личный менеджер на весь срок работы. Ответ на вопросы в течение часа.' },
]

const team = [
  { name: 'Анастасия Петрова', role: 'Главный дизайнер', exp: '8 лет' },
  { name: 'Михаил Соколов', role: 'Архитектор', exp: '6 лет' },
  { name: 'Екатерина Лебедева', role: 'Дизайнер', exp: '5 лет' },
  { name: 'Алексей Новиков', role: '3D-визуализатор', exp: '7 лет' },
  { name: 'Ирина Козлова', role: 'Проект-менеджер', exp: '4 года' },
  { name: 'Дмитрий Орлов', role: 'Дизайнер', exp: '5 лет' },
]

const grads = [
  'from-[#2A3560] to-[#1E2240]', 'from-[#2D2A50] to-[#1A1A2E]',
  'from-[#1E3040] to-[#162030]', 'from-[#302030] to-[#1A1A2E]',
  'from-[#1E2A40] to-[#162030]', 'from-[#2A2050] to-[#1E1A30]',
]

export default function AboutPage() {
  const trackRef = useRef(null)
  const scroll = (d) => trackRef.current?.scrollBy({ left: d * 440, behavior: 'smooth' })

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EF' }}>
      <div className="pt-24 pb-20">
        <div className="container">
          {/* Хлебные крошки */}
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'rgba(28,35,64,0.4)' }}>
            <Link to="/" className="hover:text-[#C9A050] transition-colors">Главная</Link>
            <span>/</span>
            <span style={{ color: '#C9A050' }}>О нас</span>
          </div>

          <FadeInView>
            <p className="section-tag-dark">О студии</p>
            <h1 className="section-title-dark mb-5 max-w-3xl">Мы не бросаем после выдачи чертежей</h1>
            <p className="max-w-2xl text-lg mb-14" style={{ color: 'rgba(28,35,64,0.6)' }}>
              Дизайн-студия «Дизайн Сейчас» — команда из 50+ профессионалов, работающих онлайн по всей России и СНГ.
            </p>
          </FadeInView>

          {/* Цифры */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {stats.map((s, i) => (
              <FadeInView key={s.num} delay={i * 0.07}>
                <div className="bg-white rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  style={{ border: '1.5px solid rgba(201,160,80,0.18)' }}>
                  <div className="text-3xl font-extrabold mb-1"
                    style={{ background: 'linear-gradient(135deg,#C9A050,#B8852E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {s.num}
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(28,35,64,0.55)' }}>{s.label}</p>
                </div>
              </FadeInView>
            ))}
          </div>

          {/* Принципы */}
          <FadeInView><p className="section-tag-dark">Как мы работаем</p><h2 className="section-title-dark mb-10">Наши принципы</h2></FadeInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
            {principles.map((p, i) => (
              <FadeInView key={p.title} delay={i * 0.06}>
                <div className="bg-white rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  style={{ border: '1.5px solid rgba(201,160,80,0.15)' }}>
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#1C2340' }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(28,35,64,0.6)' }}>{p.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>

          {/* Команда */}
          <FadeInView><p className="section-tag-dark">Люди</p><h2 className="section-title-dark mb-10">Наша команда</h2></FadeInView>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            {team.map((m, i) => (
              <FadeInView key={m.name} delay={i * 0.06}>
                <div className="text-center">
                  <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${grads[i]} mb-3 flex items-center justify-center`}>
                    <span className="text-2xl font-black" style={{ color: 'rgba(201,160,80,0.3)' }}>
                      {m.name.split(' ').map(w => w[0]).join('')}
                    </span>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: '#1C2340' }}>{m.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#C9A050' }}>{m.role}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(28,35,64,0.45)' }}>{m.exp} опыта</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </div>

      {/* Достижения — тёмная секция */}
      <div id="achievements" style={{ background: '#1C2340', padding: '5rem 0' }}>
        <div className="container">
          <FadeInView>
            <p className="section-tag" style={{ textAlign: 'center', display: 'block' }}>Признание</p>
            <h2 className="section-title mb-3" style={{ textAlign: 'center' }}>Достижения студии</h2>
            <p className="text-sm mb-10" style={{ color: 'rgba(232,228,220,0.5)', textAlign: 'center' }}>
              Грамоты от Сообщества дизайнеров интерьера России
            </p>
          </FadeInView>
          <div className="flex items-center gap-3 justify-center">
            <button onClick={() => scroll(-1)} className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all"
              style={{ background: 'rgba(201,160,80,0.1)', color: '#C9A050' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.22)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.1)' }}>←</button>
            <div ref={trackRef} className="flex gap-5 overflow-x-auto" style={{ scrollbarWidth: 'none', maxWidth: 900 }}>
              {['/gramota1.jpg', '/gramota2.jpg'].map((src, i) => (
                <div key={i} className="shrink-0 rounded-2xl overflow-hidden"
                  style={{ flex: '0 0 calc(50% - 10px)', minWidth: 260, maxWidth: 420, border: '1px solid rgba(201,160,80,0.2)' }}>
                  <img src={src} alt={`Грамота ${i + 1}`} className="w-full h-auto block" loading="lazy" />
                </div>
              ))}
            </div>
            <button onClick={() => scroll(1)} className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all"
              style={{ background: 'rgba(201,160,80,0.1)', color: '#C9A050' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.22)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.1)' }}>→</button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#F7F4EF', padding: '5rem 0' }}>
        <div className="container">
          <FadeInView>
            <div className="bg-white rounded-3xl p-10 text-center max-w-xl mx-auto shadow-sm"
              style={{ border: '1.5px solid rgba(201,160,80,0.2)' }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#1C2340' }}>Готовы обсудить ваш проект?</h2>
              <p className="text-sm mb-7" style={{ color: 'rgba(28,35,64,0.6)' }}>
                Рассчитаем стоимость и расскажем, что подойдёт именно вам.
              </p>
              <Link to="/contacts" className="btn-gold">Оставить заявку</Link>
            </div>
          </FadeInView>
        </div>
      </div>
    </div>
  )
}
