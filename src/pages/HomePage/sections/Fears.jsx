import FadeInView from '../../../shared/ui/FadeInView'

const FEARS = [
  {
    icon: '💰',
    title: 'Боюсь выйти за бюджет',
    text: 'Создаём проект строго в вашем бюджете. Только те материалы, которые можно купить прямо сейчас. Стоимость фиксируется в договоре.',
  },
  {
    icon: '🧹',
    title: 'Будет красиво, но неудобно',
    text: 'Мы спросим: где заряжаете телефон, куда деваете сумку, где сушите бельё. Красиво и по-настоящему удобно — это разные вещи.',
  },
  {
    icon: '🔨',
    title: 'Строители не поймут проект',
    text: 'Подготовим полный пакет чертежей так, чтобы любой строитель понял сразу. Если нужен авторский надзор — добавим.',
  },
  {
    icon: '📁',
    title: 'После проекта все пропадут',
    text: 'Остаёмся на связи. Если у строителей будут вопросы — ответим. Захотите изменить — обсудим. Не пропадаем.',
  },
  {
    icon: '🛠️',
    title: 'А что если что-то пойдёт не так?',
    text: 'Тогда исправим. Без споров и поиска виноватых. Ошибки бывают — мы берём за них ответственность. Гарантия в договоре.',
  },
]

export default function Fears() {
  return (
    <section className="py-24" style={{ background: '#FFFFFF' }} id="guarantees">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag-light">Мы понимаем ваши опасения</p>
            <h2 className="section-title-light">
              Знаем, чего вы боитесь.{' '}
              <span style={{ color: 'rgba(26,18,11,0.4)', fontWeight: 400, fontSize: '0.75em' }}>
                И вот как мы с этим работаем.
              </span>
            </h2>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEARS.map((f, i) => (
            <FadeInView key={f.title} delay={i * 0.07}>
              <div
                className="rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: '#FFF6DE',
                  border: '2px solid rgba(139,223,221,0.2)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(139,223,221,0.6)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(139,223,221,0.2)' }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-sm font-bold text-[#1A120B] mb-3 leading-snug">{f.title}</h3>
                <p className="text-[#1A120B]/65 text-sm leading-relaxed">{f.text}</p>
              </div>
            </FadeInView>
          ))}

          {/* CTA карточка */}
          <FadeInView delay={5 * 0.07}>
            <div
              className="rounded-2xl p-6 flex flex-col justify-between h-full"
              style={{ background: 'linear-gradient(135deg, #F48F68, #FFE394)' }}
            >
              <div>
                <h3 className="text-sm font-bold text-[#1A120B] mb-3">Остались вопросы?</h3>
                <p className="text-[#1A120B]/70 text-sm mb-6 leading-relaxed">
                  Напишите нам. Дизайнер ответит лично, без скриптов и готовых ответов.
                </p>
              </div>
              <a href="/#contacts" className="btn-dark justify-center">Написать дизайнеру</a>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
