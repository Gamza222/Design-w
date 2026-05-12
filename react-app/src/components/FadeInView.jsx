import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

const variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

/**
 * Оборачивает children в motion.div с анимацией появления при скролле.
 * @param {number} delay - задержка в секундах
 * @param {string} className - дополнительные классы
 */
export default function FadeInView({ children, delay = 0, className = '', threshold = 0.12 }) {
  const { ref, controls } = useScrollReveal(threshold)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            ...variants.visible.transition,
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
