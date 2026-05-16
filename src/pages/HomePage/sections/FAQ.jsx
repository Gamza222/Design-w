import FadeInView from '../../../shared/ui/FadeInView'

const FAQ_ITEMS = [
  {
    q: 'Нужно ли приезжать в офис?',
    a: 'Нет, работаем полностью онлайн. Обмеры делаем по вашим фотографиям и плану из документов, или высылаем замерщика — в зависимости от города.',
  },
  {
    q: 'Сколько времени займёт проект?',
    a: 'Базовая планировка — от 5 рабочих дней. Полный эскизный проект — от 3 до 6 недель. Точные сроки фиксируются в договоре.',
  },
  {
    q: 'Что если не понравится результат?',
    a: 'Делаем два варианта планировки на выбор и вносим правки до вашего согласования. Количество правок прописано в договоре.',
  },
  {
    q: 'Работаете ли с небольшими квартирами?',
    a: 'Да, у нас есть проекты от 18 м². Маленькое пространство требует особенно точного планирования — мы в этом разбираемся.',
  },
  {
    q: 'Можно заказать только планировку?',
    a: 'Конечно. Тариф «Планировка» — самый базовый пакет: обмерочный план и два варианта расстановки мебели в формате 3D-видов.',
  },
]

export default function FAQ() {
  return (
    <section className="py-24" style={{ background: '#FFF6DE' }} id="faq">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag-light">FAQ</p>
            <h2 className="section-title-light">Частые вопросы</h2>
          </div>
        </FadeInView>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FadeInView key={i} delay={i * 0.06}>
              <details className="group rounded-2xl overflow-hidden transition-all duration-200"
                style={{ background: '#FFFFFF', border: '2px solid rgba(139,223,221,0.2)' }}
                onToggle={(e) => {
                  e.currentTarget.style.borderColor = e.currentTarget.open
                    ? 'rgba(244,143,104,0.5)'
                    : 'rgba(139,223,221,0.2)'
                }}
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                  <span className="text-[#1A120B] font-semibold text-sm pr-4 leading-snug">{item.q}</span>
                  <span
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-lg font-light transition-all duration-300 group-open:rotate-45"
                    style={{ background: 'rgba(244,143,104,0.12)', color: '#F48F68' }}
                  >
                    +
                  </span>
                </summary>
                <div
                  className="px-6 pb-5 text-sm leading-relaxed pt-1"
                  style={{ borderTop: '1px solid rgba(139,223,221,0.15)', color: 'rgba(26,18,11,0.65)' }}
                >
                  {item.a}
                </div>
              </details>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
