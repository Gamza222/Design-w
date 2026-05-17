import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa'

/* ─────────────────────────────────────────────────────────────────
   HEADER
   < 1400px  →  лого + бургер
   ≥ 1400px  →  лого + nav + соцсети + телефон + кнопка

   Фон:
   • scrollY = 0        → transparent
   • scrollY > 0        → голубоватый + blur (плавно)
   • мобилка + меню     → цвет меню (только если < 1400px)

   Моб/десктоп независимы:
   • состояние menuOpen влияет на bg только если window.innerWidth < 1400
   • при ресайзе через 1400px — меню закрывается
────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: '/services',  label: 'Дизайн-проект', isRoute: true },
  { href: '/about',     label: 'О нас',          isRoute: true },
  { href: '/portfolio', label: 'Портфолио',      isRoute: true },
  { href: '/about#achievements', label: 'Достижения', isRoute: true },
  { href: '/blog',      label: 'Блог',           isRoute: true },
  { href: '/contacts',  label: 'Контакты',       isRoute: true },
]

const SOCIALS = [
  { href: 'https://t.me/yourusername',  Icon: FaTelegramPlane, label: 'Telegram' },
  { href: 'https://vk.me/yourusername', Icon: FaVk,            label: 'ВКонтакте' },
  { href: 'https://wa.me/78007077483',  Icon: FaWhatsapp,      label: 'WhatsApp' },
]

const BP       = 1400
const LOGO_H   = '2.125rem'   // 34px при 16px root — используется и для бургера
const ACCENT   = '#C9A050'
const TEXT_NAV = 'rgba(232,228,220,0.92)'
const MENU_BG  = 'rgba(18, 18, 38, 0.98)'

export default function Header() {
  const [scrollY,  setScrollY]  = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < BP : false
  )
  const location = useLocation()
  const raf = useRef(null)

  /* Скролл — rAF для плавности */
  useEffect(() => {
    const handler = () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  /* Ресайз — сброс меню при пересечении порога */
  useEffect(() => {
    let wasMobile = window.innerWidth < BP
    const handler = () => {
      const nowMobile = window.innerWidth < BP
      if (wasMobile !== nowMobile) {
        wasMobile = nowMobile
        setIsMobile(nowMobile)
        setMenuOpen(false)
        document.body.style.overflow = ''
      }
    }
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [])

  /* Роут — закрыть меню */
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  /* overflow body — только на мобилке */
  useEffect(() => {
    document.body.style.overflow = (menuOpen && isMobile) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, isMobile])

  /* ── Цвет хедера ───────────────────────────────────
     • Главная (/)  → 0…60px: прозрачный → тёмный + blur
     • Все остальные страницы → всегда тёмный (не прозрачный)
     Мобилка + меню: цвет меню
  */
  const t = Math.min(scrollY / 60, 1)
  const mobileMenuActive = menuOpen && isMobile
  const isHome = location.pathname === '/'
  const forceScrolled = !isHome

  const bgStyle = mobileMenuActive
    ? { background: MENU_BG, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,160,80,0.2)' }
    : (scrollY > 0 || forceScrolled)
      ? {
          background:           `rgba(22, 26, 52, ${forceScrolled ? '0.97' : (0.65 + 0.25 * t).toFixed(2)})`,
          backdropFilter:       `blur(${forceScrolled ? 18 : Math.round(t * 18)}px)`,
          WebkitBackdropFilter: `blur(${forceScrolled ? 18 : Math.round(t * 18)}px)`,
          borderBottom:         `1px solid rgba(201,160,80,${forceScrolled ? '0.15' : (t * 0.18).toFixed(3)})`,
        }
      : { background: 'transparent', backdropFilter: 'none', WebkitBackdropFilter: 'none', borderBottom: '1px solid transparent' }

  return (
    <>
      {/* ══════════════ ХЕДЕР ══════════════ */}
      <header
        id="header"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          minWidth: 280,
          transition: 'background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease',
          ...bgStyle,
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.875rem 1.5rem' }}
        >

          {/* ЛОГО — всегда видно */}
          <Link to="/" style={{ flexShrink: 0, lineHeight: 0 }}>
            <img
              src="/logo.png"
              alt="Дизайн Сейчас"
              style={{ height: LOGO_H, width: 'auto', display: 'block' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                if (e.currentTarget.parentElement)
                  e.currentTarget.parentElement.innerHTML =
                    `<span style="font-size:1.25rem;font-weight:800;color:#E8E4DC;letter-spacing:-0.02em">Дизайн&nbsp;<em style="color:${ACCENT};font-style:normal">Сейчас</em></span>`
              }}
            />
          </Link>

          {/* ── НАВИГАЦИЯ ДЕСКТОП ≥ 1400px ── */}
          <nav className="hidden min-[1400px]:flex items-center gap-1">
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

          {/* ── ПРАВАЯ ПАНЕЛЬ ДЕСКТОП ≥ 1400px ── */}
          <div className="hidden min-[1400px]:flex items-center gap-3" style={{ flexShrink: 0 }}>
            {/* Соцсети */}
            {SOCIALS.map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                style={{ width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid rgba(201,160,80,0.7)', color: ACCENT, background: 'rgba(201,160,80,0.08)', transition: 'background 0.2s, border-color 0.2s', flexShrink: 0 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.22)'; e.currentTarget.style.borderColor = ACCENT }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,160,80,0.7)' }}
              >
                <Icon size={15} />
              </a>
            ))}

            <div style={{ width: 1, height: '1.25rem', background: 'rgba(201,160,80,0.3)', transform: 'rotate(15deg)', flexShrink: 0 }} />

            {/* Телефон + часы работы */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', flexShrink: 0 }}>
              <a href="tel:+78007077483"
                style={{ fontSize: '0.8125rem', fontWeight: 600, color: TEXT_NAV, whiteSpace: 'nowrap', lineHeight: 1.2 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT }}
                onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_NAV }}
              >
                8 (800) 707-74-83
              </a>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0, boxShadow: '0 0 5px rgba(74,222,128,0.7)' }} />
                <span style={{ fontSize: '0.6875rem', color: 'rgba(232,228,220,0.6)', letterSpacing: '0.01em' }}>10:00–19:00</span>
              </span>
            </div>

            {/* CTA */}
            <a href="/#price"
              style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5625rem 1.375rem', borderRadius: '3rem', fontSize: '0.8125rem', fontWeight: 700, background: ACCENT, color: '#1A1A2E', border: `2px solid ${ACCENT}`, whiteSpace: 'nowrap', transition: 'background 0.25s, color 0.25s', flexShrink: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ACCENT }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = '#1A1A2E' }}
            >
              Рассчитать проект
            </a>
          </div>

          {/* ── БУРГЕР < 1400px ── (высота = LOGO_H) */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className="flex min-[1400px]:hidden items-center justify-center"
            style={{ width: LOGO_H, height: LOGO_H, flexShrink: 0, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {/*
              Контейнер: 26×18px — три линии по 2.5px, зазор 6.75px.
              Анимация ТОЛЬКО через transform (translateY + rotate) — никакого reflow.
              Задержка 0.05s на rotate чтобы сначала линии сдвинулись, потом повернулись.
            */}
            <span style={{
              display: 'block',
              position: 'relative',
              width: 26,
              height: 18,
              flexShrink: 0,
            }}>
              {/* Верхняя: translateY(7.75px) + rotate(45deg) */}
              <span style={{
                position: 'absolute', left: 0, right: 0,
                height: 2.5, borderRadius: 2, background: ACCENT,
                top: 0,
                transform: menuOpen ? 'translateY(7.75px) rotate(45deg)' : 'translateY(0) rotate(0deg)',
                transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
              }} />
              {/* Средняя: fade + shrink */}
              <span style={{
                position: 'absolute', left: 0, right: 0,
                height: 2.5, borderRadius: 2, background: ACCENT,
                top: '50%', marginTop: -1.25,
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'scaleX(0.4)' : 'scaleX(1)',
                transition: 'opacity 0.22s ease, transform 0.22s ease',
              }} />
              {/* Нижняя: translateY(-7.75px) + rotate(-45deg) */}
              <span style={{
                position: 'absolute', left: 0, right: 0,
                height: 2.5, borderRadius: 2, background: ACCENT,
                bottom: 0,
                transform: menuOpen ? 'translateY(-7.75px) rotate(-45deg)' : 'translateY(0) rotate(0deg)',
                transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </span>
          </button>

        </div>
      </header>

      {/* ══════════════ МОБИЛЬНОЕ МЕНЮ < 1400px ══════════════ */}
      {/* Только рендерится / работает на мобилке (pointer-events) */}
      <div
        className="min-[1400px]:hidden"
        style={{ position: 'fixed', inset: 0, zIndex: 99, pointerEvents: menuOpen ? 'auto' : 'none' }}
      >
        {/* Затемнение */}
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,20,0.6)', backdropFilter: 'blur(2px)', opacity: menuOpen ? 1 : 0, transition: 'opacity 0.3s ease' }}
        />

        {/* Панель меню — сдвигается сверху */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            background: MENU_BG,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(201,160,80,0.2)',
            transform: menuOpen ? 'translateY(0)' : 'translateY(-105%)',
            transition: 'transform 0.36s cubic-bezier(0.4,0,0.2,1)',
            minWidth: 280,
            overflowY: 'auto',
            maxHeight: '100dvh',
          }}
        >
          {/* Шапка с лого + крестик */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.5rem' }}>
            <Link to="/" onClick={() => setMenuOpen(false)} style={{ lineHeight: 0 }}>
              <img src="/logo.png" alt="Дизайн Сейчас" style={{ height: LOGO_H, width: 'auto' }}
                onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </Link>
            <button onClick={() => setMenuOpen(false)} aria-label="Закрыть"
              style={{ width: LOGO_H, height: LOGO_H, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                <line x1="4" y1="4" x2="20" y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="20" y1="4" x2="4"  y2="20" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Ссылки */}
          <nav style={{ padding: '0.25rem 1.5rem 0.5rem' }}>
            {NAV_LINKS.map((link) => {
              const s = { display: 'block', padding: '0.8125rem 0', fontSize: '0.9375rem', fontWeight: 500, color: TEXT_NAV, borderBottom: '1px solid rgba(201,160,80,0.09)', transition: 'color 0.2s' }
              const enter = (e) => { e.currentTarget.style.color = ACCENT }
              const leave = (e) => { e.currentTarget.style.color = TEXT_NAV }
              return link.isRoute
                ? <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)} style={s} onMouseEnter={enter} onMouseLeave={leave}>{link.label}</Link>
                : <a    key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={s} onMouseEnter={enter} onMouseLeave={leave}>{link.label}</a>
            })}
          </nav>

          {/* Соцсети → Телефон → Кнопка */}
          <div style={{ padding: '1.25rem 1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Соцсети */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {SOCIALS.map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid rgba(201,160,80,0.4)', color: ACCENT, transition: 'background 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,160,80,0.14)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Телефон */}
            <a href="tel:+78007077483"
              style={{ fontSize: '1.0625rem', fontWeight: 700, color: ACCENT, transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              8 (800) 707-74-83
            </a>

            {/* Кнопка */}
            <a href="/#price" onClick={() => setMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.75rem 1.75rem', borderRadius: '3rem', fontSize: '0.875rem', fontWeight: 700, background: ACCENT, color: '#1A1A2E', border: `2px solid ${ACCENT}`, whiteSpace: 'nowrap', transition: 'background 0.25s, color 0.25s', boxSizing: 'border-box' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ACCENT }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = '#1A1A2E' }}
            >
              Рассчитать проект
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
