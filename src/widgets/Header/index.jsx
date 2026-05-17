import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa'

/* ─────────────────────────────────────────────────────────────────
   HEADER — финальные требования:

   ЛОГИКА ФОНА:
   • scrollY = 0          → полностью прозрачный (всегда)
   • scrollY > 0          → плавно появляется голубоватый фон + blur
   • мобильное меню открыто → фон меню (только если реально мобилка < 1400px)
   • десктоп/мобилка НЕ зависят друг от друга по состояниям

   РАЗМЕРЫ:
   • Лого: 2.125rem (= 34px при 16px base) — динамичная единица
   • Бургер: height = 2.125rem (= лого) — задаётся через CSS var

   РЕСЕТ:
   • При ресайзе через 1400px порог — мобильное меню закрывается
   • Overflow body сбрасывается при переходе на десктоп

   ШРИФТЫ:
   • Везде rem-единицы
────────────────────────────────────────────────────────────────── */

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

const DESKTOP_BP  = 1400        // px, порог бургера
const LOGO_H      = '2.125rem'  // = 34px при 16px root
const MENU_BG     = 'rgba(20, 20, 40, 0.98)'
const ACCENT      = '#C9A050'
const TEXT_NAV    = 'rgba(232,228,220,0.92)'

// Голубоватый фон при скролле
const SCROLL_BG   = (a) => `rgba(22, 26, 52, ${a})`  // чуть теплее navy

export default function Header() {
  const [scrollY,   setScrollY]   = useState(0)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [isMobile,  setIsMobile]  = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < DESKTOP_BP : false
  )
  const location = useLocation()
  const rafRef   = useRef(null)

  /* ── Плавный scroll (rAF) ─────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    // Инициализируем сразу
    setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  /* ── Ресайз: сброс мобильного меню при переходе на десктоп ── */
  useEffect(() => {
    let prev = window.innerWidth < DESKTOP_BP
    const onResize = () => {
      const curr = window.innerWidth < DESKTOP_BP
      // Пересекли порог в любую сторону — сбрасываем меню
      if (prev !== curr) {
        setMenuOpen(false)
        setIsMobile(curr)
        document.body.style.overflow = ''
        prev = curr
      }
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ── Закрываем меню при смене роута ─────────────────── */
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  /* ── Блокируем скролл только на мобилке с меню ─────── */
  useEffect(() => {
    // Блокируем ТОЛЬКО если мы реально на мобилке
    document.body.style.overflow = (menuOpen && isMobile) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, isMobile])

  /* ── Фон хедера ──────────────────────────────────────
     scrollY = 0 → прозрачный
     scrollY > 0 → голубоватый + blur
     мобилка + меню → цвет меню
  */
  const t = Math.min(scrollY / 60, 1)   // 0…1 за 60px

  // Если мобилка с открытым меню — специальный фон
  const isMobileMenuActive = menuOpen && isMobile

  const bgColor = isMobileMenuActive
    ? MENU_BG
    : scrollY > 0
      ? SCROLL_BG(0.65 + 0.25 * t)      // 0.65 → 0.90 плавно
      : 'transparent'

  const blurPx = isMobileMenuActive
    ? 20
    : Math.round(t * 18)                 // 0 → 18px

  const borderA = isMobileMenuActive
    ? 0.2
    : t * 0.18                           // 0 → 0.18

  return (
    <>
      {/* ─────────── ХЕДЕР ─────────── */}
      <header
        id="header"
        style={{
          position:             'fixed',
          top: 0, left: 0, right: 0,
          zIndex:               100,
          minWidth:             '280px',
          background:           bgColor,
          backdropFilter:       blurPx > 0 ? `blur(${blurPx}px)` : 'none',
          WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
          borderBottom:         `1px solid rgba(201,160,80,${borderA})`,
          transition:           [
            'background 0.38s ease',
            'backdrop-filter 0.38s ease',
            'border-color 0.38s ease',
          ].join(', '),
        }}
      >
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.875rem 1.5rem',    /* 14px 24px — rem */
        }}>

          {/* ЛОГО */}
          <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <img
              src="/logo.png"
              alt="Дизайн Сейчас"
              style={{ height: LOGO_H, width: 'auto', display: 'block' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerHTML =
                    `<span style="font-size:1.25rem;font-weight:800;color:#E8E4DC;letter-spacing:-0.02em">
                      Дизайн <em style="color:${ACCENT};font-style:normal">Сейчас</em>
                    </span>`
                }
              }}
            />
          </Link>

          {/* ── ДЕСКТОП НАВИГАЦИЯ (≥ 1400px) ── */}
          <nav style={{ display: 'none' }} className="min-[1400px]:flex items-center gap-0.5"
            // React не любит смешение — используем className для display
          >
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

          {/* ── ПРАВАЯ ЧАСТЬ ДЕСКТОП ── */}
          <div className="hidden min-[1400px]:flex items-center gap-3">
            {/* Соцсети */}
            {SOCIALS.map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                style={{
                  width: '2rem', height: '2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  border: `1px solid rgba(201,160,80,0.35)`,
                  color: ACCENT,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.14)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <Icon size={14} />
              </a>
            ))}

            {/* Разделитель */}
            <div style={{ width: 1, height: '1.25rem', background: 'rgba(201,160,80,0.3)', transform: 'rotate(15deg)', flexShrink: 0 }} />

            {/* Телефон */}
            <a href="tel:+78007077483"
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: TEXT_NAV, whiteSpace: 'nowrap' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT }}
              onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_NAV }}
            >
              8 (800) 707-74-83
            </a>
            <span style={{ fontSize: '0.75rem', color: 'rgba(232,228,220,0.38)', whiteSpace: 'nowrap' }}>
              10:00–19:00
            </span>

            {/* CTA */}
            <a href="/#price"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '0.5625rem 1.375rem',   /* 9px 22px */
                borderRadius: '3rem',
                fontSize: '0.8125rem', fontWeight: 700,
                background: ACCENT, color: '#1A1A2E',
                border: `2px solid ${ACCENT}`,
                whiteSpace: 'nowrap',
                transition: 'background 0.25s, color 0.25s',
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

          {/* ── БУРГЕР (< 1400px) — высота = лого ── */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="min-[1400px]:hidden"
            style={{
              width:      LOGO_H,   /* 2.125rem — = высота лого */
              height:     LOGO_H,
              flexShrink: 0,
              background: 'transparent',
              border:     'none',
              cursor:     'pointer',
              padding:    0,
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="22" height="22"
              viewBox="0 0 24 24"
              fill="none"
              style={{ overflow: 'visible' }}
            >
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="20" y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="20" y1="4" x2="4"  y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
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

      {/* ─────────── МОБИЛЬНОЕ МЕНЮ (< 1400px) ─────────── */}
      {/*
        Независимо от десктопа.
        Сдвигается translateY вниз из-под хедера.
      */}
      <div
        className="min-[1400px]:hidden"
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        99,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position:   'absolute',
            inset:      0,
            background: 'rgba(8, 8, 20, 0.6)',
            backdropFilter: 'blur(2px)',
            opacity:    menuOpen ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Панель меню */}
        <div
          style={{
            position:        'absolute',
            top:             0, left: 0, right: 0,
            background:      MENU_BG,
            backdropFilter:  'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom:    '1px solid rgba(201,160,80,0.2)',
            transform:       menuOpen ? 'translateY(0)' : 'translateY(-105%)',
            transition:      'transform 0.36s cubic-bezier(0.4,0,0.2,1)',
            minWidth:        '280px',
            overflowY:       'auto',
            maxHeight:       '100dvh',
          }}
        >
          {/* Шапка меню */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.5rem',
          }}>
            <Link to="/" onClick={() => setMenuOpen(false)}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <img
                src="/logo.png"
                alt="Дизайн Сейчас"
                style={{ height: LOGO_H, width: 'auto', display: 'block' }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </Link>
            {/* Крестик */}
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Закрыть меню"
              style={{
                width: LOGO_H, height: LOGO_H,
                background: 'transparent', border: 'none',
                cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <line x1="4" y1="4" x2="20" y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="20" y1="4" x2="4"  y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Навигация */}
          <nav style={{ padding: '0.25rem 1.5rem 0.5rem' }}>
            {NAV_LINKS.map((link) => {
              const style = {
                display: 'block',
                padding: '0.8125rem 0',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: TEXT_NAV,
                borderBottom: '1px solid rgba(201,160,80,0.09)',
                transition: 'color 0.2s',
              }
              return link.isRoute ? (
                <Link key={link.label} to={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={style}
                  onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_NAV }}
                >
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={style}
                  onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_NAV }}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Соцсети → Телефон → Кнопка */}
          <div style={{ padding: '1.25rem 1.5rem 1.75rem' }}>
            {/* Соцсети */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {SOCIALS.map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  style={{
                    width: '2.5rem', height: '2.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    border: '1px solid rgba(201,160,80,0.4)',
                    color: ACCENT,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.14)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Телефон */}
            <a href="tel:+78007077483"
              style={{
                display: 'block',
                fontSize: '1.0625rem', fontWeight: 700,
                color: ACCENT,
                marginBottom: '1rem',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              8 (800) 707-74-83
            </a>

            {/* Кнопка */}
            <a href="/#price"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.6875rem 1.75rem',
                borderRadius: '3rem',
                fontSize: '0.875rem', fontWeight: 700,
                background: ACCENT, color: '#1A1A2E',
                border: `2px solid ${ACCENT}`,
                whiteSpace: 'nowrap',
                transition: 'background 0.25s, color 0.25s',
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
    </>
  )
}
