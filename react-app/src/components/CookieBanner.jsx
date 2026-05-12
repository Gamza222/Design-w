import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookieAccepted')) {
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const hide = () => {
    setHiding(true)
    setTimeout(() => setVisible(false), 400)
  }

  const accept = () => {
    localStorage.setItem('cookieAccepted', '1')
    hide()
  }

  if (!visible) return null

  return (
    <div
      className={`cookie-banner transition-all duration-400 ${
        hiding ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-[#1E2240] border border-[rgba(201,169,122,0.2)] rounded-2xl p-5 shadow-2xl max-w-xl w-full mx-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-[rgba(232,228,220,0.75)] text-sm flex-1 leading-relaxed">
          Мы используем <strong className="text-[#E8E4DC]">cookies</strong> для корректной работы сайта.
          Продолжая пользоваться сайтом, вы соглашаетесь с нашей{' '}
          <a href="#" className="text-[#C9A97A] underline">политикой конфиденциальности</a>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={accept} className="btn-gold text-xs px-4 py-2">Принять</button>
          <button
            onClick={hide}
            className="text-[rgba(232,228,220,0.4)] text-xs hover:text-[rgba(232,228,220,0.7)] transition-colors px-3 py-2"
          >
            Отказаться
          </button>
        </div>
      </div>
    </div>
  )
}
