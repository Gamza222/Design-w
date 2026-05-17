import FadeInView from '../../../shared/ui/FadeInView'

const faqItems = [
  {
    q: 'Нужно ли мне приезжать к вам в офис?',
    a: 'Нет, мы работаем полностью онлайн. Обмеры делаем по вашим фотографиям и плану из документов на квартиру, или высылаем замерщика — в зависимости от города.',
  },
  {
    q: 'Сколько времени займёт разработка проекта?',
    a: 'Базовая планировка — от 5 рабочих дней. Полный эскизный проект — от 3 до 6 недель, в зависимости от площади и сложности. Точные сроки фиксируются в договоре.',
  },
  {
    q: 'Что если мне не понравится результат?',
    a: 'Мы делаем два варианта планировки на выбор и вносим правки до вашего согласования. Количество правок по концепции прописано в договоре.',
  },
  {
    q: 'Работаете ли вы с небольшими квартирами?',
    a: 'Да, у нас есть проекты от 18 м². Маленькое пространство требует особенно точного планирования, и мы в этом хорошо разбираемся.',
  },
  {
    q: 'Могу ли я заказать только планировку без визуализации?',
    a: 'Конечно. У нас есть тариф "Планировка" — это самый базовый пакет. Вы получите обмерочный план и два варианта расстановки мебели в формате 3D-видов.',
  },
]

export default function FAQ() {
  return (
    <section className="py-24 bg-[#F7F4EF]" id="faq">
      <div className="container">
        <FadeInView>
          <div className="text-center mb-12">
            <p className="section-tag-dark">Частые вопросы</p>
            <h2 className="section-title-dark">Вопросы, которые задают чаще всего</h2>
          </div>
        </FadeInView>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, i) => (
            <FadeInView key={i} delay={i * 0.07}>
              <details className="group bg-white border border-[rgba(254,193,4,0.15)] rounded-2xl overflow-hidden hover:border-[rgba(254,193,4,0.35)] transition-all duration-300">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                  <span className="text-[#1C2340] font-semibold text-sm pr-4">{item.q}</span>
                  <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-[rgba(254,193,4,0.1)] text-[#FEC104] transition-transform duration-300 group-open:rotate-45 text-lg font-light">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-[rgba(28,35,64,0.65)] text-sm leading-relaxed border-t border-[rgba(254,193,4,0.08)] pt-4">
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
