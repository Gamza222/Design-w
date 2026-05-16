import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Закрываем меню при переходе
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navLinks = [
    { to: isHome ? '#services' : '/#services', label: 'Дизайн-проект' },
    { to: isHome ? '#about' : '/#about', label: 'О нас' },
    { to: '/portfolio', label: 'Портфолио' },
    { to: isHome ? '#achievements' : '/#achievements', label: 'Достижения' },
    { to: '/blog', label: 'Блог' },
    { to: isHome ? '#contacts' : '/#contacts', label: 'Контакты' },
  ]

  const socials = [
    { href: 'https://t.me/yourusername', icon: FaTelegramPlane, label: 'Telegram' },
    { href: 'https://vk.me/yourusername', icon: FaVk, label: 'VK' },
    { href: 'https://wa.me/78007077483', icon: FaWhatsapp, label: 'WhatsApp' },
  ]

  const closeMenu = () => setMenuOpen(false)

  const linkClass = (to) => {
    const isActive = location.pathname === to ||
      (to === '/portfolio' && location.pathname === '/portfolio') ||
      (to === '/blog' && location.pathname.startsWith('/blog'))
    return `px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
      isActive
        ? 'text-[#C9A97A] bg-[rgba(201,169,122,0.08)]'
        : 'text-[rgba(30,35,64,0.85)] hover:text-[#C9A97A] hover:bg-[rgba(201,169,122,0.08)]'
    } ${scrolled ? '' : 'text-[rgba(232,228,220,0.85)] hover:text-[#C9A97A]'}`
  }

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/лого для сайта дизайн сейчас.png"
            alt="Дизайн Сейчас"
            className="h-10 w-auto"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.innerHTML =
                '<span class="text-xl font-bold text-[#1C2340]">Дизайн <em class="text-[#C9A97A] not-italic">Сейчас</em></span>'
            }}
          />
        </Link>

        {/* Десктопная навигация */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.to.startsWith('#') || link.to.startsWith('/#') ? (
              <a
                key={link.label}
                href={link.to}
                className={linkClass(link.to)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className={linkClass(link.to)}
              >
                {link.label}
              </Link>
            )
          )}
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
                className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 ${
                  scrolled
                    ? 'border-[rgba(201,169,122,0.4)] text-[#C9A97A] hover:bg-[rgba(201,169,122,0.12)] hover:border-[#C9A97A]'
                    : 'border-[rgba(201,169,122,0.3)] text-[#C9A97A] hover:bg-[rgba(201,169,122,0.15)] hover:border-[#C9A97A]'
                }`}
              >
                <s.icon size={15} />
              </a>
            ))}
          </div>
          <div className="w-px h-5 bg-[rgba(201,169,122,0.25)]" />
          <a
            href="tel:+78007077483"
            className={`text-sm font-medium transition-colors whitespace-nowrap ${
              scrolled ? 'text-[#1C2340] hover:text-[#C9A97A]' : 'text-[#E8E4DC] hover:text-[#C9A97A]'
            }`}
          >
            8 (800) 707-74-83
          </a>
          <span className={`text-xs whitespace-nowrap ${scrolled ? 'text-[rgba(28,35,64,0.4)]' : 'text-[rgba(232,228,220,0.4)]'}`}>
            10:00–19:00
          </span>
          <a href="/#price" className="btn-gold text-xs px-4 py-2 whitespace-nowrap">
            Рассчитать проект
          </a>
        </div>

        {/* Бургер (мобильный) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[rgba(201,169,122,0.1)] transition-colors"
          aria-label="Меню"
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? 'bg-[#1C2340]' : 'bg-[#C9A97A]'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? 'bg-[#1C2340]' : 'bg-[#C9A97A]'} ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? 'bg-[#1C2340]' : 'bg-[#C9A97A]'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Мобильное меню */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-lg shadow-lg transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container py-4 flex flex-col gap-1">
          {navLinks.map((link) =>
            link.to.startsWith('#') || link.to.startsWith('/#') ? (
              <a
                key={link.label}
                href={link.to}
                onClick={closeMenu}
                className="px-4 py-3 text-[#1C2340] text-sm border-b border-[rgba(201,169,122,0.08)] hover:text-[#C9A97A] transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                onClick={closeMenu}
                className="px-4 py-3 text-[#1C2340] text-sm border-b border-[rgba(201,169,122,0.08)] hover:text-[#C9A97A] transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <div className="pt-4 flex items-center justify-between">
            <a href="tel:+78007077483" className="text-[#C9A97A] font-semibold">
              8 (800) 707-74-83
            </a>
            <a href="/#price" onClick={closeMenu} className="btn-gold text-xs px-4 py-2">
              Рассчитать проект
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
