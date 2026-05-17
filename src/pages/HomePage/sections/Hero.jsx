import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STATS = [
  { num: '500+',  label: 'выполненных проектов' },
  { num: '5 лет', label: 'на рынке с 2021 года' },
  { num: '50+',   label: 'городов России и СНГ' },
  { num: '4.9 ★', label: 'средняя оценка' },
]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.88, 0.96])

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center overflow-hidden">

      {/* Фон */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')", y: bgY }}
      />

      {/* Оверлей — фиолетово-синий градиент (12 мая) */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,46,0.90) 0%, rgba(26,26,46,0.70) 60%, rgba(22,33,62,0.80) 100%)',
          opacity: overlayOpacity,
        }}
      />

      {/* Декоративные блики */}
      <div
        className="absolute top-1/3 right-[-120px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(254,193,4,0.08) 0%, transparent 70%)' }}
      />

      {/* Контент */}
      <div className="container relative z-10 pt-28 pb-20">

        {/* Бейдж — пилюля (стиль 12 мая) */}
        <motion.div
          className="inline-flex items-center mb-6"
          style={{
            background: 'rgba(254,193,4,0.12)',
            border: '1px solid rgba(254,193,4,0.35)',
            color: '#FEC104',
            fontSize: 12, fontWeight: 600,
            padding: '8px 18px',
            borderRadius: 50,
            letterSpacing: '0.05em',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Студия дизайна интерьера с 2021 года
        </motion.div>

        {/* Заголовок */}
        <motion.h1
          className="mb-7 max-w-4xl"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            lineHeight: 1.2,
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Строка 1 — никогда не переносится */}
          <span style={{
            display: 'block',
            whiteSpace: 'nowrap',
            fontSize: 'clamp(24px, 4.6vw, 62px)',
          }}>
            Создаём и реализуем
          </span>

          {/* Строка 2 — интерьер + вашей мечты */}
          <span style={{
            display: 'block',
            fontSize: 'clamp(24px, 4.6vw, 62px)',
          }}>
            интерьер{' '}
            <span
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontWeight: 400,
                fontSize: 'clamp(48px, 8.2vw, 110px)',
                lineHeight: 1.1,
                verticalAlign: 'middle',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(90deg, #FEC104 0%, #F0D898 50%, #FEC104 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              вашей мечты
            </span>
          </span>
        </motion.h1>

        {/* Подзаголовок */}
        <motion.p
          style={{
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            color: 'rgba(255,255,255,0.58)',
            maxWidth: 520,
            marginBottom: '2.25rem',
            lineHeight: 1.75,
            fontWeight: 400,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Продумываем всё до начала ремонта: где хранить, как освещать, как двигаться.
          Узнайте ориентировочную стоимость за 30 минут.
        </motion.p>

        {/* Кнопки */}
        <motion.div
          className="flex flex-wrap gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a href="/#contacts" className="btn-gold text-[15px] px-8 py-[14px]">
            Рассчитать стоимость
          </a>
          <a href="/#portfolio" className="btn-outline text-[15px] px-8 py-[14px]">
            Смотреть работы
          </a>
        </motion.div>

        {/* Статистика — горизонтально без карточек (стиль 12 мая) */}
        <div className="flex gap-12 flex-wrap">
          {STATS.map((s, i) => (
            <motion.div
              key={s.num}
              className="flex flex-col"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 + i * 0.08 }}
            >
              <span
                className="text-[30px] font-extrabold leading-none"
                style={{ color: '#FEC104' }}
              >
                {s.num}
              </span>
              <span className="text-[12px] mt-1 text-white/50">{s.label}</span>
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
        <motion.div
          className="w-[1px] h-10 rounded-full"
          style={{ background: 'linear-gradient(to bottom, rgba(254,193,4,0.7), transparent)' }}
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
