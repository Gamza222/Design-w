import { useEffect, useRef } from 'react'
import { useInView, useAnimation } from 'framer-motion'

/**
 * Хук для плавного появления элементов при скролле.
 * Возвращает { ref, controls } для использования с motion-компонентами.
 * @param {number} threshold - процент видимости элемента для триггера (0–1)
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: threshold })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  return { ref, controls }
}
