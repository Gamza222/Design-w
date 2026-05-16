import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

/* ──────────────────────────────────────────────────────────
   HEADER
   - Прозрачный при старте страницы
   - При скролле: белый фон + shadow
   - Бургер-меню начиная с 1400px (nav: breakpoint)
   - Все ссылки — якоря на главной, только Portfolio/Blog → отдельные страницы
────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: '/#services',      label: 'Дизайн-проект' },
  { href: '/#portfolio',     label: 'Портфолио' },
  { href: '/#about',         label: 'О нас' },
  { href: '/#reviews',       label: 'Отзывы' },
  { href: '/#blog',          label: 'Блог' },
  { href: '/#contacts',      label: 'Контакты' },
]

const SOCIALS = [
  { href: 'https://t.me/yourusername',  label: 'TG', title: 'Telegram' },
  { href: 'https://vk.me/yourusername', label: 'VK', title: 'ВКонтакте' },
  { href: 'https://wa.me/78007077483',  label: 'WA', title: 'WhatsApp' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  /* Следим за скроллом */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Закрываем меню при смене роута */
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  /* Блокируем скролл при открытом меню */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isDark = !scrolled && !menuOpen   // прозрачный = тёмный текст НЕТ (фон тёмный)
  // Когда прозрачный — текст белый (Hero тёмный)
  // Когда scrolled — фон белый, текст тёмный

  return (
    <>
      <header
        id="header"
        style={{
          background: scrolled
            ? 'rgba(255,255,255,0.97)'
            : menuOpen
            ? '#1C2340'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          boxShadow: scrolled ? '0 2px 24px rgba(26,18,11,0.10)' : 'none',
          padding: scrolled ? '10px 0' : '18px 0',
        }}
      >
        <div className="container flex items-center justify-between gap-4">

          {/* ЛОГОТИП */}
          <Link to="/" className="flex items-center shrink-0 z-10">
            <img
              src="/лого для сайта дизайн сейчас.png"
              alt="Дизайн Сейчас"
              className="h-10 w-auto"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML =
                  `<span style="font-size:18px;font-weight:800;color:${scrolled ? '#1A120B' : '#ffffff'}">
                    Дизайн <span style="color:#F48F68">Сейчас</span>
                  </span>`
              }}
            />
          </Link>

          {/* ДЕСКТОПНАЯ НАВИГАЦИЯ (≥ 1400px) */}
          <nav className="hidden nav:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`
                  px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${scrolled
                    ? 'text-[#1A120B]/80 hover:text-[#F48F68] hover:bg-[#F48F68]/8'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ПРАВАЯ ЧАСТЬ (только десктоп) */}
          <div className="hidden nav:flex items-center gap-3">
            {/* Соцсети */}
            <div className="flex gap-1.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.title}
                  className={`
                    w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold
                    border transition-all duration-200
                    ${scrolled
                      ? 'border-[#1A120B]/15 text-[#1A120B]/60 hover:border-[#8BDFDD] hover:text-[#8BDFDD] hover:bg-[#8BDFDD]/8'
                      : 'border-white/20 text-white/60 hover:border-white hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {s.label}
                </a>
              ))}
            </div>

            {/* Разделитель */}
            <div className={`w-px h-5 ${scrolled ? 'bg-[#1A120B]/12' : 'bg-white/20'}`} />

            {/* Телефон */}
            <a
              href="tel:+78007077483"
              className={`text-sm font-semibold transition-colors whitespace-nowrap ${
                scrolled ? 'text-[#1A120B] hover:text-[#F48F68]' : 'text-white hover:text-[#FFE394]'
              }`}
            >
              8 (800) 707-74-83
            </a>

            {/* CTA */}
            <a
              href="/#contacts"
              className="btn-coral text-xs px-4 py-2.5"
            >
              Получить проект
            </a>
          </div>

          {/* БУРГЕР (< 1400px) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav:hidden relative z-10 flex flex-col justify-center gap-[5px] w-10 h-10 rounded-xl p-2 transition-all duration-200"
            style={{
              background: menuOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span
              className="block h-0.5 w-6 rounded-full transition-all duration-300 origin-center"
              style={{
                background: scrolled && !menuOpen ? '#1A120B' : '#ffffff',
                transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
              }}
            />
            <span
              className="block h-0.5 w-6 rounded-full transition-all duration-300"
              style={{
                background: scrolled && !menuOpen ? '#1A120B' : '#ffffff',
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
              }}
            />
            <span
              className="block h-0.5 w-6 rounded-full transition-all duration-300 origin-center"
              style={{
                background: scrolled && !menuOpen ? '#1A120B' : '#ffffff',
                transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* ── МОБИЛЬНОЕ МЕНЮ (< 1400px) ─────────────────── */}
      <div
        className={`
          nav:hidden fixed inset-0 z-[99] transition-all duration-300
          ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
        style={{ top: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          style={{ opacity: menuOpen ? 1 : 0 }}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className="absolute top-0 right-0 h-full w-full max-w-sm bg-[#1C2340] shadow-2xl transition-transform duration-300 flex flex-col"
          style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}
        >
          {/* Шапка меню */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <img
                src="/лого для сайта дизайн сейчас.png"
                alt="Дизайн Сейчас"
                className="h-9 w-auto"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              aria-label="Закрыть"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Ссылки */}
          <nav className="flex flex-col py-4 flex-1 overflow-y-auto">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-4 text-white/85 hover:text-white hover:bg-white/8 transition-all duration-200 text-base font-medium border-b border-white/5"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F48F68] shrink-0" />
                {link.label}
              </a>
            ))}
          </nav>

          {/* Контакты в меню */}
          <div className="p-6 border-t border-white/10 space-y-3">
            <a
              href="tel:+78007077483"
              className="block text-[#8BDFDD] font-bold text-lg hover:text-white transition-colors"
            >
              8 (800) 707-74-83
            </a>
            <p className="text-white/40 text-xs">Бесплатно по России · Пн–Пт 10:00–19:00</p>
            <div className="flex gap-2 pt-1">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-[#8BDFDD]/20 text-white text-xs font-bold transition-all border border-white/10 hover:border-[#8BDFDD]/40"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <a
              href="/#contacts"
              onClick={() => setMenuOpen(false)}
              className="btn-coral w-full justify-center mt-2"
            >
              Получить проект
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
