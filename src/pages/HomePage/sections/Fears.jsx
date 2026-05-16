import FadeInView from '../../../shared/ui/FadeInView'

const fears = [
  {
    icon: '💰',
    title: 'Боюсь, что выйдет дороже запланированного',
    text: 'Мы создаём проект строго в рамках вашего бюджета. Предлагаем только те материалы, которые реально можно купить прямо сейчас. Стоимость работ прописана в договоре и не меняется в процессе.',
  },
  {
    icon: '🧹',
    title: 'Будет красиво, но неудобно жить',
    text: 'Мы обязательно спросим: где вы привыкли заряжать телефон, куда деваете сумку, когда приходите домой, где сушите бельё. Мы хотим понять вашу жизнь — тогда всё будет не просто красиво, но и по-настоящему удобно.',
  },
  {
    icon: '🔨',
    title: 'Как передать проект строителям',
    text: 'Мы подготовим полный пакет чертежей и описаний так, чтобы любой строитель понял, что и как делать. А если нужен авторский надзор — просто скажите нам об этом.',
  },
  {
    icon: '📁',
    title: 'Боюсь, что после получения проекта никого не найдёшь',
    text: 'Мы остаёмся на связи после выдачи проекта. Если у строителей возникнут вопросы по чертежам, мы ответим. Если захотите что-то изменить, обсудим. Мы не пропадаем.',
  },
  {
    icon: '🛠️',
    title: 'Что будет, если что-то пойдёт не так',
    text: 'Тогда мы просто исправим это. Без споров, без поиска виноватых. Ошибки бывают у всех, но мы берём за них ответственность на себя. Гарантия по условиям договора.',
  },
]

export default function Fears() {
  return (
    <section className="py-24 bg-[#F7F4EF]" id="guarantees">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag-dark">Мы понимаем ваши опасения</p>
            <h2 className="section-title-dark">
              Мы знаем, чего вы боитесь.{' '}
              <span className="text-[rgba(28,35,64,0.5)] font-normal text-2xl md:text-3xl">
                И вот как мы с этим работаем.
              </span>
            </h2>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fears.map((f, i) => (
            <FadeInView key={f.title} delay={i * 0.08}>
              <div className="bg-white border border-[rgba(201,169,122,0.15)] rounded-2xl p-6 hover:border-[rgba(201,169,122,0.4)] hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-semibold text-[#1C2340] mb-3 leading-snug">{f.title}</h3>
                <p className="text-[rgba(28,35,64,0.6)] text-sm leading-relaxed">{f.text}</p>
              </div>
            </FadeInView>
          ))}

          {/* CTA карточка */}
          <FadeInView delay={5 * 0.08}>
            <div className="bg-gradient-to-br from-[#C9A97A] to-[#B8852E] rounded-2xl p-6 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-base font-semibold text-[#1C2340] mb-3">Остались вопросы?</h3>
                <p className="text-[rgba(28,35,64,0.7)] text-sm mb-6 leading-relaxed">
                  Напишите нам в любое время. Дизайнер ответит лично, по-человечески. Без скриптов и готовых ответов.
                </p>
              </div>
              <a href="#contacts" className="btn-dark justify-center">
                Написать дизайнеру
              </a>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
