import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookieAccepted')) {
      const t = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookieAccepted', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner fixed bottom-5 left-1/2 -translate-x-1/2 z-[999] w-[min(480px,calc(100vw-32px))] bg-[#1E2240] border border-[rgba(201,169,122,0.2)] rounded-2xl p-5 shadow-2xl flex items-center gap-4">
      <p className="text-[rgba(232,228,220,0.7)] text-xs leading-relaxed flex-1">
        Мы используем cookies для улучшения работы сайта.{' '}
        <a href="#" className="text-[#C9A97A] underline">Подробнее</a>
      </p>
      <button
        onClick={accept}
        className="btn-gold text-xs px-4 py-2 shrink-0"
      >
        Принять
      </button>
    </div>
  )
}
