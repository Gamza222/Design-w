import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa'

/* ─────────────────────────────────────────────────────────────────
   HEADER — все требования:
   • Новое лого /logo.png
   • Плавный scroll-эффект через инлайн-стиль (без className-скачков)
   • Цвет навигации ВСЕГДА белый/светлый (не меняется при скролле)
   • Бургер с 1400px (кастомный breakpoint)
   • Меню открыто → хедер всегда цвета меню
   • В мобильном меню: навигация → соцсети → телефон → кнопка
   • До 500px блоки идут по-очереди вертикально
   • Минимальная ширина сайта 280px
   • Крестик правильный, золотой
───────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: '/#services',     label: 'Дизайн-проект' },
  { href: '/#about',        label: 'О нас' },
  { href: '/portfolio',     label: 'Портфолио', isRoute: true },
  { href: '/#achievements', label: 'Достижения' },
  { href: '/blog',          label: 'Блог', isRoute: true },
  { href: '/#contacts',     label: 'Контакты' },
]

const SOCIALS = [
  { href: 'https://t.me/yourusername',  Icon: FaTelegramPlane, label: 'Telegram' },
  { href: 'https://vk.me/yourusername', Icon: FaVk,            label: 'ВКонтакте' },
  { href: 'https://wa.me/78007077483',  Icon: FaWhatsapp,      label: 'WhatsApp' },
]

const MENU_BG   = 'rgba(22, 22, 42, 0.98)'
const ACCENT    = '#C9A050'
const TEXT_NAV  = 'rgba(232,228,220,0.90)'   // всегда такой — не меняем при скролле

export default function Header() {
  const [scrollY, setScrollY]   = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const rafRef   = useRef(null)

  /* Плавный scroll через requestAnimationFrame */
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  /* Закрываем меню при смене роута */
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  /* Блокируем скролл пока меню открыто */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* ─── Фон хедера ───
     Всегда прозрачный.
     ТОЛЬКО если мобильное меню открыто → цвет меню.
     (скролл-цвет добавим позже по скрину от пользователя)
  */
  const headerBg = menuOpen ? MENU_BG : 'transparent'
  const blur     = menuOpen ? 20 : 0
  const border   = menuOpen ? 0.2 : 0
  const padV     = 14   // фиксированный — без прыжков

  return (
    <>
      {/* ── ХЕДЕР ──────────────────────────────────────── */}
      <header
        id="header"
      style={{
          position:             'fixed',
          top:                  0, left: 0, right: 0,
          zIndex:               100,
          background:           headerBg,
          backdropFilter:       blur > 0 ? `blur(${blur}px)` : 'none',
          WebkitBackdropFilter: blur > 0 ? `blur(${blur}px)` : 'none',
          borderBottom:         border > 0 ? `1px solid rgba(201,160,80,${border})` : '1px solid transparent',
          transition:           'background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease',
          minWidth:             280,
        }}
      >
        {/* Внутренняя строка */}
        <div
        className="container flex items-center justify-between gap-3"
          style={{ paddingTop: padV, paddingBottom: padV }}
        >

          {/* ЛОГО */}
          <Link to="/" className="shrink-0 flex items-center">
            <img
              src="/logo.png"
              alt="Дизайн Сейчас"
              style={{ height: 34, width: 'auto', display: 'block' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerHTML =
                    '<span style="font-size:20px;font-weight:800;color:#E8E4DC;letter-spacing:-0.02em">Дизайн <em style="color:#C9A050;font-style:normal">Сейчас</em></span>'
                }
              }}
            />
          </Link>

          {/* ── ДЕСКТОП НАВИГАЦИЯ (≥ 1400px) ── */}
          <nav className="hidden min-[1400px]:flex items-center gap-0.5">
            {NAV_LINKS.map((link) =>
              link.isRoute ? (
                <Link key={link.label} to={link.href}
                  className="nav-link-desktop"
                  style={{ color: TEXT_NAV }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_NAV }}
                >
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href}
                  className="nav-link-desktop"
                  style={{ color: TEXT_NAV }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_NAV }}
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* ── ПРАВАЯ ЧАСТЬ ДЕСКТОП (≥ 1400px) ── */}
          <div className="hidden min-[1400px]:flex items-center gap-3">
            {/* Соцсети */}
            <div className="flex gap-1.5">
              {SOCIALS.map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
                  style={{ border: `1px solid rgba(201,160,80,0.35)`, color: ACCENT }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.15)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

            {/* Разделитель */}
            <div style={{ width: 1, height: 20, background: 'rgba(201,160,80,0.3)', transform: 'rotate(15deg)', flexShrink: 0 }} />

            {/* Телефон */}
            <a href="tel:+78007077483"
              className="text-[13px] font-semibold whitespace-nowrap transition-colors"
              style={{ color: TEXT_NAV }}
              onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT }}
              onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_NAV }}
            >
              8 (800) 707-74-83
            </a>
            <span className="text-xs whitespace-nowrap" style={{ color: 'rgba(232,228,220,0.40)' }}>10:00–19:00</span>

            {/* CTA */}
            <a href="/#price"
              className="inline-flex items-center text-[13px] font-bold whitespace-nowrap transition-all duration-300"
              style={{
                padding: '9px 22px', borderRadius: 50,
                background: ACCENT, color: '#1A1A2E',
                border: `2px solid ${ACCENT}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = ACCENT
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ACCENT
                e.currentTarget.style.color = '#1A1A2E'
              }}
            >
              Рассчитать проект
            </a>
          </div>

          {/* ── БУРГЕР (< 1400px) ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="min-[1400px]:hidden flex items-center justify-center"
            style={{
              width: 34, height: 34, background: 'transparent',
              border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
            }}
          >
            {/* Кастомный SVG крестик/бургер */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                /* Крестик — правильный, золотой */
                <>
                  <line x1="4" y1="4" x2="20" y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="20" y1="4" x2="4" y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                /* Три полоски */
                <>
                  <line x1="3" y1="6"  x2="21" y2="6"  stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="21" y2="12" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="3" y1="18" x2="21" y2="18" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* ── МОБИЛЬНОЕ МЕНЮ (< 1400px) ──────────────────── */}
      {/*
        Backdrop (закрывает по клику вне меню)
        Drawer справа/снизу — зависит от ширины
      */}
      <div
        className="min-[1400px]:hidden"
        style={{
          position:   'fixed',
          inset:      0,
          zIndex:     99,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {/* Затемнение */}
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position:   'absolute',
            inset:      0,
            background: 'rgba(10,8,20,0.55)',
            backdropFilter: 'blur(2px)',
            opacity:    menuOpen ? 1 : 0,
            transition: 'opacity 0.35s ease',
          }}
        />

        {/* Само меню — сдвигается сверху */}
        <div
          style={{
            position:   'absolute',
            top:        0, left: 0, right: 0,
            background: MENU_BG,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: `1px solid rgba(201,160,80,0.2)`,
            transform:   menuOpen ? 'translateY(0)' : 'translateY(-105%)',
            transition:  'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth:    280,
            overflowY:   'auto',
            maxHeight:   '100dvh',
          }}
        >
          {/* Шапка меню */}
          <div
            className="container flex items-center justify-between"
            style={{ paddingTop: padV, paddingBottom: padV, transition: 'padding 0.4s ease' }}
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0 flex items-center">
              <img
                src="/logo.png"
                alt="Дизайн Сейчас"
                style={{ height: 34, width: 'auto', display: 'block' }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </Link>
            {/* Крестик в шапке меню */}
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Закрыть меню"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="4" y1="4" x2="20" y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="20" y1="4" x2="4" y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Навигация */}
          <nav className="container flex flex-col" style={{ paddingTop: 8, paddingBottom: 8 }}>
            {NAV_LINKS.map((link) =>
              link.isRoute ? (
                <Link key={link.label} to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: TEXT_NAV,
                    padding: '13px 0',
                    borderBottom: '1px solid rgba(201,160,80,0.10)',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_NAV }}
                >
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: TEXT_NAV,
                    padding: '13px 0',
                    borderBottom: '1px solid rgba(201,160,80,0.10)',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_NAV }}
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Соцсети + телефон + кнопка */}
          <div className="container" style={{ paddingTop: 20, paddingBottom: 28 }}>

            {/*
              До 500px — блоки идут вертикально по-очереди:
              соцсети → телефон → кнопка
              500px+ — горизонтально
            */}
            <div
              className="flex flex-col min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between gap-4"
            >
              {/* Соцсети */}
              <div className="flex gap-2">
                {SOCIALS.map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                    className="flex items-center justify-center rounded-full transition-all duration-200"
                    style={{
                      width: 40, height: 40,
                      border: `1px solid rgba(201,160,80,0.4)`,
                      color: ACCENT,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.15)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>

              {/* Телефон */}
              <a href="tel:+78007077483"
                className="text-base font-bold transition-colors"
                style={{ color: ACCENT }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                8 (800) 707-74-83
              </a>

              {/* Кнопка */}
              <a href="/#price"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center text-[13px] font-bold transition-all duration-300 whitespace-nowrap"
                style={{
                  padding: '10px 24px', borderRadius: 50,
                  background: ACCENT, color: '#1A1A2E',
                  border: `2px solid ${ACCENT}`,
                  alignSelf: 'flex-start',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = ACCENT
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = ACCENT
                  e.currentTarget.style.color = '#1A1A2E'
                }}
              >
                Рассчитать проект
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
