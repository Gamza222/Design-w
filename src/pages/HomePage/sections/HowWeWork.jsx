import FadeInView from '../../../shared/ui/FadeInView'

const steps = [
  {
    num: '01',
    icon: '📞',
    title: 'Заявка и знакомство',
    text: 'Вы оставляете заявку — дизайнер перезванивает в течение 30 минут. Обсуждаем вашу задачу, площадь, стиль и бюджет.',
  },
  {
    num: '02',
    icon: '📐',
    title: 'Замеры и техническое задание',
    text: 'Составляем подробное ТЗ на основе вашего образа жизни. Фиксируем всё: где хранить, где работать, как двигаться по квартире.',
  },
  {
    num: '03',
    icon: '✏️',
    title: 'Разработка проекта',
    text: 'Делаем планировку в двух вариантах на выбор, концепцию с материалами и 3D-визуализации всех помещений.',
  },
  {
    num: '04',
    icon: '📦',
    title: 'Передача документации',
    text: 'Вы получаете полный пакет чертежей и спецификаций. Строители сразу понимают, что делать — без лишних вопросов.',
  },
]

export default function HowWeWork() {
  return (
    <section className="py-24 bg-[#1C2340]" id="process">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-14">
            <p className="section-tag">Процесс</p>
            <h2 className="section-title">Как мы работаем</h2>
            <p className="section-sub">От первого звонка до готового проекта — чётко и без сюрпризов</p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <FadeInView key={step.num} delay={i * 0.1}>
              <div className="relative bg-[#1E2240] border border-[rgba(254,193,4,0.12)] rounded-2xl p-6 h-full hover:border-[rgba(254,193,4,0.3)] transition-all duration-300 group">
                {/* Соединительная линия */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-6 h-px bg-gradient-to-r from-[rgba(254,193,4,0.3)] to-transparent z-10" />
                )}
                <div className="text-3xl mb-3">{step.icon}</div>
                <span className="text-4xl font-bold text-[rgba(254,193,4,0.15)] block mb-2">{step.num}</span>
                <h3 className="text-base font-semibold text-[#E8E4DC] mb-2">{step.title}</h3>
                <p className="text-[rgba(232,228,220,0.6)] text-sm leading-relaxed">{step.text}</p>
              </div>
            </FadeInView>
          ))}
        </div>

        <FadeInView delay={0.3} className="text-center mt-12">
          <a href="#contacts" className="btn-gold px-8 py-4 text-base">
            Начать проект
          </a>
        </FadeInView>
      </div>
    </section>
  )
}
