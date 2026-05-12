import { useState, useEffect } from 'react'
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#services', label: 'Дизайн-проект' },
    { href: '#about', label: 'О нас' },
    { href: '#portfolio', label: 'Портфолио' },
    { href: '#achievements', label: 'Достижения' },
    { href: '#blog', label: 'Блог' },
    { href: '#contacts', label: 'Контакты' },
  ]

  const socials = [
    { href: 'https://t.me/yourusername', icon: FaTelegramPlane, label: 'Telegram' },
    { href: 'https://vk.me/yourusername', icon: FaVk, label: 'VK' },
    { href: 'https://wa.me/78007077483', icon: FaWhatsapp, label: 'WhatsApp' },
  ]

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(26,26,46,0.6)] backdrop-blur-xl shadow-[0_2px_24px_rgba(0,0,0,0.35)] py-2 border-b border-[rgba(201,169,122,0.08)]'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Логотип */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <img
            src="/лого для сайта дизайн сейчас.png"
            alt="Дизайн Сейчас"
            className="h-10 w-auto"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML =
                '<span class="text-xl font-bold text-[#E8E4DC]">Дизайн <em class="text-[#C9A97A] not-italic">Сейчас</em></span>'
            }}
          />
        </a>

        {/* Десктопная навигация */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-[rgba(232,228,220,0.8)] text-sm hover:text-[#C9A97A] transition-colors duration-200 rounded-lg hover:bg-[rgba(201,169,122,0.08)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Правая часть */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[rgba(201,169,122,0.3)] text-[#C9A97A] hover:bg-[rgba(201,169,122,0.15)] hover:border-[#C9A97A] transition-all duration-200"
              >
                <s.icon size={15} />
              </a>
            ))}
          </div>
          <div className="w-px h-5 bg-[rgba(201,169,122,0.2)]" />
          <a href="tel:+78007077483" className="text-[#E8E4DC] text-sm font-medium hover:text-[#C9A97A] transition-colors whitespace-nowrap">
            8 (800) 707-74-83
          </a>
          <span className="text-[rgba(232,228,220,0.4)] text-xs whitespace-nowrap">10:00–19:00</span>
          <a href="#price" className="btn-gold text-xs px-4 py-2 whitespace-nowrap">
            Рассчитать проект
          </a>
        </div>

        {/* Бургер (мобильный) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[rgba(201,169,122,0.1)] transition-colors"
          aria-label="Меню"
        >
          <span className={`block w-6 h-0.5 bg-[#C9A97A] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#C9A97A] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#C9A97A] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Мобильное меню */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-[rgba(26,26,46,0.98)] backdrop-blur-lg border-b border-[rgba(201,169,122,0.15)] transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="px-4 py-3 text-[rgba(232,228,220,0.85)] text-sm border-b border-[rgba(201,169,122,0.08)] hover:text-[#C9A97A] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 flex items-center justify-between">
            <a href="tel:+78007077483" className="text-[#C9A97A] font-semibold">
              8 (800) 707-74-83
            </a>
            <a href="#price" onClick={closeMenu} className="btn-gold text-xs px-4 py-2">
              Рассчитать проект
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
