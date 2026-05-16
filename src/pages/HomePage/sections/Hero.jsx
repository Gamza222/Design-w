import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.78, 0.95])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  const stats = [
    { num: '500+', label: 'выполненных проектов' },
    { num: '5 лет', label: 'на рынке с 2021 года' },
    { num: '50+', label: 'городов России и СНГ' },
    { num: '4.9 ★', label: 'средняя оценка клиентов' },
  ]

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Фоновое изображение — параллакс */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: "url('/hero-bg.jpg')", y: bgY }}
      />

      {/* Оверлей */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#1C2340] via-[#1C2340] to-[#243050]"
        style={{ opacity: overlayOpacity }}
      />

      {/* Декоративные орбы */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#C9A97A]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-100px] w-[400px] h-[400px] bg-[#243050]/60 rounded-full blur-[80px] pointer-events-none" />

      {/* Контент */}
      <motion.div className="container relative z-10" style={{ y: contentY }}>
        <motion.p
          className="section-tag mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Студия дизайна интерьера с 2021 года
        </motion.p>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E8E4DC] leading-tight mb-3 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Создаём и реализуем{' '}
          <span className="bg-gradient-to-r from-[#C9A97A] to-[#F5B800] bg-clip-text text-transparent">
            интерьер вашей мечты
          </span>
        </motion.h1>

        {/* Подстрочник */}
        <motion.p
          className="text-[rgba(232,228,220,0.45)] text-sm mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Стадия дизайна интерьера с 2021 года
        </motion.p>

        <motion.p
          className="text-[rgba(232,228,220,0.75)] text-lg max-w-2xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          Мы думаем о том, где будет стоять пылесос, как удобно сушить бельё и как сделать интерьер
          именно таким, каким вы его представляете. Напишите нам — покажем ориентировочную
          стоимость за 30 минут.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a href="#price" className="btn-gold text-base px-8 py-4">
            Рассчитать стоимость работ
          </a>
        </motion.div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.num}
              className="bg-[rgba(255,255,255,0.05)] backdrop-blur-sm border border-[rgba(201,169,122,0.15)] rounded-2xl p-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#C9A97A] to-[#F5B800] bg-clip-text text-transparent mb-1">
                {s.num}
              </div>
              <div className="text-[rgba(232,228,220,0.65)] text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll-индикатор */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[rgba(232,228,220,0.3)] text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-[rgba(201,169,122,0.5)] to-transparent"
          animate={{ scaleY: [1, 0.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
