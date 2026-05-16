import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STATS = [
  { num: '500+',  label: 'выполненных проектов' },
  { num: '5 лет', label: 'на рынке с 2021 года' },
  { num: '50+',   label: 'городов России' },
  { num: '4.9 ★', label: 'средняя оценка' },
]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.72, 0.92])

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center overflow-hidden">

      {/* Фон — параллакс */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')", y: bgY }}
      />

      {/* Тёмный оверлей */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1C2340 0%, #243050 100%)',
          opacity: overlayOpacity,
        }}
      />

      {/* Декоративные пятна */}
      <div
        className="absolute top-1/4 right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,223,221,0.12) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244,143,104,0.10) 0%, transparent 70%)' }}
      />

      {/* Контент */}
      <div className="container relative z-10 pt-28 pb-20">
        <motion.p
          className="section-tag mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Студия дизайна интерьера с 2021 года
        </motion.p>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Создаём интерьер,{' '}
          <span style={{
            background: 'linear-gradient(90deg, #F48F68, #FFE394)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            в котором удобно жить
          </span>
        </motion.h1>

        <motion.p
          className="text-white/70 text-base md:text-lg max-w-xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Продумываем всё до начала ремонта: где хранить, как освещать, как двигаться по квартире.
          Узнайте ориентировочную стоимость за 30 минут.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a href="/#contacts" className="btn-coral px-8 py-4 text-base">
            Рассчитать стоимость
          </a>
          <a href="/#portfolio" className="btn-white px-8 py-4 text-base">
            Смотреть работы
          </a>
        </motion.div>

        {/* Статистика */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
          {STATS.map((s, i) => (
            <motion.div
              key={s.num}
              className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 + i * 0.08 }}
            >
              <div
                className="text-2xl font-bold mb-0.5"
                style={{
                  background: 'linear-gradient(90deg, #F48F68, #FFE394)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.num}
              </div>
              <div className="text-white/55 text-xs leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <span className="text-white/30 text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          className="w-px h-8"
          style={{ background: 'linear-gradient(to bottom, rgba(139,223,221,0.6), transparent)' }}
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
