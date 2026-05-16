import FadeInView from '../../../shared/ui/FadeInView'

const STEPS = [
  {
    num: '01', icon: '📞',
    title: 'Заявка и знакомство',
    text: 'Оставляете заявку — дизайнер звонит за 30 минут. Обсуждаем задачу, площадь, стиль и бюджет.',
  },
  {
    num: '02', icon: '📐',
    title: 'Замеры и ТЗ',
    text: 'Составляем техзадание по вашему образу жизни: где хранить, где работать, как двигаться.',
  },
  {
    num: '03', icon: '✏️',
    title: 'Разработка проекта',
    text: 'Два варианта планировки на выбор, концепция с материалами, 3D-визуализации всех помещений.',
  },
  {
    num: '04', icon: '📦',
    title: 'Передача документации',
    text: 'Полный пакет чертежей и спецификаций. Строители сразу понимают что делать — без вопросов.',
  },
]

export default function HowWeWork() {
  return (
    <section className="py-24" style={{ background: '#1C2340' }} id="process">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-14">
            <p className="section-tag">Процесс</p>
            <h2 className="section-title">Как мы работаем</h2>
            <p className="section-sub mx-auto">
              От первого звонка до готового проекта — чётко и без сюрпризов
            </p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <FadeInView key={step.num} delay={i * 0.1}>
              <div
                className="relative rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(139,223,221,0.5)'
                  e.currentTarget.style.background = 'rgba(139,223,221,0.07)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              >
                {/* Соединяющая линия */}
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 left-full w-6 h-px"
                    style={{ background: 'linear-gradient(to right, rgba(139,223,221,0.4), transparent)', zIndex: 10 }}
                  />
                )}
                <div className="text-3xl mb-3">{step.icon}</div>
                <span
                  className="text-4xl font-bold block mb-2"
                  style={{ color: 'rgba(255,255,255,0.08)' }}
                >
                  {step.num}
                </span>
                <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{step.text}</p>
              </div>
            </FadeInView>
          ))}
        </div>

        <FadeInView delay={0.35} className="text-center mt-12">
          <a href="/#contacts" className="btn-coral px-8 py-4 text-base">Начать проект</a>
        </FadeInView>
      </div>
    </section>
  )
}
