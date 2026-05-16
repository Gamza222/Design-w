import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="py-14" style={{ background: '#1A120B', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Бренд */}
          <div>
            <img
              src="/лого для сайта дизайн сейчас.png"
              alt="Дизайн Сейчас"
              className="h-12 w-auto mb-4"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.insertAdjacentHTML('afterbegin',
                  '<span style="font-size:20px;font-weight:800;color:#FFF6DE">Дизайн <em style="color:#F48F68;font-style:normal">Сейчас</em></span>'
                )
              }}
            />
            <p style={{ color: 'rgba(255,246,222,0.45)', fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>
              Студия дизайна интерьера. Делаем пространства, в которых хочется проводить время.
            </p>
            <p style={{ color: 'rgba(255,246,222,0.25)', fontSize: 12 }}>
              © 2025 Дизайн Сейчас. Все права защищены.
            </p>
          </div>

          {/* Услуги */}
          <div>
            <h4 style={{ color: '#FFF6DE', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Услуги</h4>
            {[
              { href: '/#services', label: 'Дизайн-проект' },
              { to: '/portfolio',   label: 'Портфолио' },
              { href: '/#about',    label: 'О нас' },
              { to: '/blog',        label: 'Блог' },
              { href: '/#contacts', label: 'Контакты' },
            ].map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} className="block mb-2 text-sm transition-colors"
                  style={{ color: 'rgba(255,246,222,0.4)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F48F68' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,246,222,0.4)' }}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="block mb-2 text-sm transition-colors"
                  style={{ color: 'rgba(255,246,222,0.4)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F48F68' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,246,222,0.4)' }}>
                  {l.label}
                </a>
              )
            )}
          </div>

          {/* Контакты */}
          <div>
            <h4 style={{ color: '#FFF6DE', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Контакты</h4>
            <a href="tel:+78007077483" className="block mb-2 text-sm transition-colors"
              style={{ color: 'rgba(255,246,222,0.4)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#F48F68' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,246,222,0.4)' }}>
              8 (800) 707-74-83
            </a>
            <a href="mailto:dizain.seichas@yandex.ru" className="block mb-4 text-sm transition-colors"
              style={{ color: 'rgba(255,246,222,0.4)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#8BDFDD' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,246,222,0.4)' }}>
              dizain.seichas@yandex.ru
            </a>
            <div className="flex gap-2">
              {['TG', 'VK', 'WA'].map((s) => (
                <a key={s} href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all"
                  style={{ background: 'rgba(255,246,222,0.06)', color: 'rgba(255,246,222,0.45)', border: '1px solid rgba(255,246,222,0.08)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,143,104,0.15)'; e.currentTarget.style.color = '#F48F68' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,246,222,0.06)'; e.currentTarget.style.color = 'rgba(255,246,222,0.45)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Документы */}
          <div>
            <h4 style={{ color: '#FFF6DE', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Документы</h4>
            {['Политика конфиденциальности', 'Реквизиты компании', 'Договор оферты', 'Лицензия на товарный знак'].map((doc) => (
              <a key={doc} href="#" className="block mb-2 text-sm transition-colors"
                style={{ color: 'rgba(255,246,222,0.4)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#8BDFDD' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,246,222,0.4)' }}>
                {doc}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
